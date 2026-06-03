import { GoogleAuthButton } from "@/auth/components";
import { AuthContext, canAccessAdminPanel, getUserRoleNames } from "@/auth";
import { accountAPI } from "@/auth/account.api";
import { toast } from "@/components";
import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { publicAssets } from "./public-home/cloudinary-assets";
import { PublicLayout } from "./public-home/public-layout";
import "./account-page.css";

const dayLabels: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

const formatDate = (value?: string | null) => {
  if (!value) return "Sin registrar";
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(value));
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "Sin registrar";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatCurrency = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const emptyValue = (value?: string | number | null) => {
  if (value === 0) return "0";
  return value ? String(value) : "Sin registrar";
};

const parseContactMethods = (value?: string) =>
  (value || "email")
    .split(",")
    .map((method) => method.trim())
    .filter(Boolean);

const getApiMessage = (data: unknown, fallback: string) => {
  if (!data) return fallback;

  const payload = data as { message?: unknown; phone?: unknown };
  if (typeof payload.message === "string") return payload.message;
  if (Array.isArray(payload.phone)) return String(payload.phone[0]);
  if (typeof payload.phone === "string") return payload.phone;
  return fallback;
};

type AccountPreferenceKey =
  | "marketing_opt_in"
  | "news_opt_in"
  | "impact_opt_in"
  | "data_processing_opt_in";

type AccountPreferences = Record<AccountPreferenceKey, boolean> & {
  preferred_contact: string;
};

const preferenceOptions: Array<[AccountPreferenceKey, string]> = [
  ["marketing_opt_in", "Recibir campañas"],
  ["news_opt_in", "Recibir noticias"],
  ["impact_opt_in", "Recibir información de impacto"],
  ["data_processing_opt_in", "Acepto tratamiento de datos"],
];

type AccountActivity = {
  id?: number | string;
  action?: string | null;
  description?: string | null;
  timestamp?: string | null;
};

type AccountDonation = {
  donation_type?: string | null;
};

type AccountPermission = {
  id?: number | string;
  codename?: string | null;
  name?: string | null;
};

type AccountProfile = {
  phone?: string | null;
  preferred_contact?: string | null;
  marketing_opt_in?: boolean | null;
  news_opt_in?: boolean | null;
  impact_opt_in?: boolean | null;
  data_processing_opt_in?: boolean | null;
  photo_url?: string | null;
  has_google?: boolean | null;
  google_email?: string | null;
};

type AccountUser = {
  username?: string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  is_active?: boolean | null;
  is_superuser?: boolean | null;
  date_joined?: string | null;
  has_usable_password?: boolean | null;
  permissions?: unknown;
  profile?: AccountProfile | null;
};

type AccountVolunteerAvailability = {
  id?: number | string;
  day_of_week: number;
  start_time?: string | null;
  end_time?: string | null;
};

type AccountVolunteer = {
  identification_number?: string | null;
  phone?: string | null;
  status_label?: string | null;
  support_area_label?: string | null;
  availabilities: AccountVolunteerAvailability[];
};

type AccountDonationSummary = {
  count?: number | null;
  completed_count?: number | null;
  total_completed?: number | string | null;
};

type AccountData = {
  user?: AccountUser | null;
  volunteer?: AccountVolunteer | null;
  donations?: unknown;
  donations_summary?: AccountDonationSummary | null;
  activity?: unknown;
};

const normalizeCollection = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  const collection = value as Record<string, unknown>;
  if (Array.isArray(collection.results)) return collection.results as T[];

  return Object.values(collection).flatMap((entry) => (Array.isArray(entry) ? (entry as T[]) : []));
};

function AccountInfoCard({
  icon,
  title,
  rows,
}: {
  icon: string;
  title: string;
  rows: Array<[string, string]>;
}) {
  return (
    <article className="account-info-card">
      <header>
        <i className={`pi ${icon}`} />
        <h2>{title}</h2>
      </header>
      <div className="account-info-rows">
        {rows.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function ParticipationCard({
  icon,
  title,
  value,
  detail,
  tone,
}: {
  icon: string;
  title: string;
  value: number | string;
  detail: string;
  tone: "purple" | "teal" | "gold" | "rose";
}) {
  return (
    <article className={`account-participation-card is-${tone}`}>
      <i className={`pi ${icon}`} />
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
      <Link to="/programas">Ver más <i className="pi pi-arrow-right" /></Link>
    </article>
  );
}

export function AccountPage() {
  const { refresh, logout } = useContext(AuthContext);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [contactMethods, setContactMethods] = useState<string[]>(["email"]);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [preferences, setPreferences] = useState<AccountPreferences>({
    marketing_opt_in: true,
    news_opt_in: true,
    impact_opt_in: true,
    data_processing_opt_in: false,
    preferred_contact: "email",
  });

  const user = account?.user;
  const profile = user?.profile;
  const volunteer = account?.volunteer;
  const donations = useMemo(() => normalizeCollection<AccountDonation>(account?.donations), [account?.donations]);
  const activity = useMemo(() => normalizeCollection<AccountActivity>(account?.activity), [account?.activity]);
  const permissions = useMemo(() => normalizeCollection<AccountPermission>(user?.permissions), [user?.permissions]);
  const donationSummary = account?.donations_summary ?? {};
  const donationCount = donationSummary.count ?? 0;
  const roles = useMemo(() => getUserRoleNames(user), [user]);
  const showRoles = Boolean(user?.is_superuser || roles.length > 0 || canAccessAdminPanel(user));

  const fullName = useMemo(() => {
    const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
    return name || user?.username || "Miembro MTM";
  }, [user]);

  const participation = useMemo(() => ({
    volunteerCount: volunteer ? volunteer.availabilities?.length || 1 : 0,
    eventsCount: activity.filter((item) => String(item.action).includes("event")).length,
    campaignsCount: donationCount,
    sponsorCount: donations.filter((donation) => donation.donation_type === "PERMANENT_SPONSOR").length,
  }), [activity, donationCount, donations, volunteer]);

  const loadAccount = async () => {
    setLoading(true);
    try {
      const { status, data } = await accountAPI.getAccount();
      if (status >= 200 && status < 300) {
        setAccount(data);
        setProfileForm({
          first_name: data.user?.first_name ?? "",
          last_name: data.user?.last_name ?? "",
          email: data.user?.email ?? "",
          phone: data.user?.profile?.phone ?? "",
        });
        setContactMethods(parseContactMethods(data.user?.profile?.preferred_contact));
        setPreferences({
          marketing_opt_in: Boolean(data.user?.profile?.marketing_opt_in),
          news_opt_in: Boolean(data.user?.profile?.news_opt_in),
          impact_opt_in: Boolean(data.user?.profile?.impact_opt_in),
          data_processing_opt_in: Boolean(data.user?.profile?.data_processing_opt_in),
          preferred_contact: data.user?.profile?.preferred_contact || "email",
        });
        return;
      }
      throw new Error(data?.message || "No se pudo cargar tu cuenta.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar tu cuenta.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (contactMethods.length === 0) {
      toast.warn("Selecciona al menos una forma de contacto.");
      return;
    }

    if ((contactMethods.includes("phone") || contactMethods.includes("whatsapp")) && !profileForm.phone.trim()) {
      toast.warn("Ingresa tu celular para usar teléfono o WhatsApp como contacto.");
      return;
    }

    setSaving(true);

    try {
      const { status, data } = await accountAPI.updateAccount({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: profileForm.email,
        profile: {
          ...preferences,
          phone: profileForm.phone,
          preferred_contact: contactMethods.join(","),
        },
      });

      if (status >= 200 && status < 300) {
        setAccount(data);
        setEditing(false);
        await refresh();
        toast.success("Cuenta actualizada correctamente.");
        return;
      }

      throw new Error(getApiMessage(data, "No se pudo actualizar tu cuenta."));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar tu cuenta.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const { status, data } = await accountAPI.updateProfilePhoto(file);
      if (status >= 200 && status < 300) {
        setAccount(data);
        toast.success("Foto de perfil actualizada.");
        return;
      }
      throw new Error(data?.message || "No se pudo actualizar la foto.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la foto.");
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const { status, data } = await accountAPI.changePassword(passwordForm);

      if (status >= 200 && status < 300) {
        toast.success("Contraseña actualizada correctamente.");
        setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
        await loadAccount();
        return;
      }

      throw new Error(data?.message || "No se pudo actualizar la contraseña.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la contraseña.");
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleCredential = useCallback(async (credential: string) => {
    const { status, data } = await accountAPI.linkGoogle(credential);

    if (status >= 200 && status < 300) {
      setAccount(data);
      await refresh();
      toast.success("Cuenta de Google vinculada correctamente.");
      return;
    }

    throw new Error(data?.message || "No se pudo vincular Google.");
  }, [refresh]);

  const toggleContactMethod = (method: string) => {
    setContactMethods((current) => {
      if (current.includes(method)) {
        return current.filter((item) => item !== method);
      }
      return [...current, method];
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <PublicLayout className="account-public-layout">
        <section className="account-page-loading">
          <i className="pi pi-spin pi-spinner" />
          <span>Cargando tu cuenta...</span>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout className="account-public-layout">
      <section className="account-dashboard">
        <aside className="account-sidebar">
          <section className="account-profile-panel">
            <div className="account-profile-cover">
              <button
                type="button"
                className="account-avatar-edit"
                disabled={saving}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Cambiar foto de perfil"
              >
                <i className="pi pi-pencil" />
              </button>
            </div>
            <div className="account-avatar">
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt={`Foto de ${fullName}`} />
              ) : (
                <i className="pi pi-user" />
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} hidden />
            <h2>{fullName}</h2>
            <span className="account-status-pill">
              <i className="pi pi-check-circle" />
              {user?.is_active ? "Miembro activo" : "Cuenta inactiva"}
            </span>

            <div className="account-member-tags">
              {volunteer && <span><i className="pi pi-heart" /> Voluntaria</span>}
              {donationCount > 0 && <span><i className="pi pi-gift" /> Donante</span>}
              {participation.sponsorCount > 0 && <span><i className="pi pi-star" /> Padrino permanente</span>}
              {!volunteer && donationCount === 0 && <span><i className="pi pi-users" /> Comunidad MTM</span>}
            </div>

            <div className="account-side-note">
              <i className="pi pi-calendar" />
              <span>Miembro desde<br /><strong>{formatDate(user?.date_joined)}</strong></span>
            </div>
            <div className="account-side-note account-side-note--message">
              <i className="pi pi-star-fill" />
              <span><strong>Tu compromiso transforma vidas.</strong><br />Gracias por ser parte de Fundación MTM.</span>
            </div>
          </section>

          <section className="account-quick-card">
            <h3>Accesos rápidos</h3>
            <Link to="/donar"><i className="pi pi-heart" /> Mis donaciones</Link>
            <Link to="/eventos-publicos"><i className="pi pi-calendar" /> Eventos</Link>
            <Link to="/programas"><i className="pi pi-map" /> Programas</Link>
            <Link to="/contacto"><i className="pi pi-envelope" /> Preferencias de comunicación</Link>
            <div className="account-help-box">
              <i className="pi pi-heart-fill" />
              <strong>¿Necesitas ayuda?</strong>
              <span>Contáctanos, estamos para servirte.</span>
              <Link to="/contacto">Ir a contacto <i className="pi pi-arrow-right" /></Link>
            </div>
          </section>
        </aside>

        <div className="account-main">
          <header className="account-titlebar">
            <div>
              <h1>Mi Cuenta</h1>
              <p>Gestiona tu información, participa y da seguimiento a tu apoyo.</p>
            </div>
            <button className="account-edit-btn" type="button" onClick={() => setEditing((value) => !value)}>
              <i className={`pi ${editing ? "pi-times" : "pi-pencil"}`} />
              {editing ? "Cerrar edición" : "Editar perfil"}
            </button>
          </header>

          <div className="account-card-grid account-card-grid--two">
            <AccountInfoCard
              icon="pi-user"
              title="Datos personales"
              rows={[
                ["Nombre completo", fullName],
                ["Usuario", emptyValue(user?.username)],
                ["Documento de identidad", emptyValue(volunteer?.identification_number)],
                ["Fecha de nacimiento", "Sin registrar"],
                ["Género", "Sin registrar"],
              ]}
            />
            <AccountInfoCard
              icon="pi-envelope"
              title="Información de contacto"
              rows={[
                ["Correo electrónico", emptyValue(user?.email)],
                ["Teléfono móvil", emptyValue(profile?.phone || volunteer?.phone)],
                ["Ciudad", "Sin registrar"],
                ["Dirección", "Sin registrar"],
                ["Preferencias", contactMethods.map((method) => ({ email: "Correo", phone: "Teléfono", whatsapp: "WhatsApp" }[method] ?? method)).join(", ")],
                ["Acceso", profile?.has_google ? "Google vinculado" : "Acceso local"],
              ]}
            />
          </div>

          {editing && (
            <form className="account-edit-panel" onSubmit={handleProfileSubmit}>
              <header>
                <i className="pi pi-id-card" />
                <div>
                  <h2>Editar información</h2>
                  <p>Actualiza tus datos básicos y preferencias de comunicación.</p>
                </div>
              </header>
              <div className="account-form-grid">
                <label>
                  Nombre
                  <input value={profileForm.first_name} onChange={(event) => setProfileForm((current) => ({ ...current, first_name: event.target.value }))} />
                </label>
                <label>
                  Apellido
                  <input value={profileForm.last_name} onChange={(event) => setProfileForm((current) => ({ ...current, last_name: event.target.value }))} />
                </label>
                <label>
                  Correo electrónico
                  <input type="email" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} />
                </label>
              </div>
              <div className="account-contact-methods">
                <span>Formas de contacto</span>
                <div>
                  {[
                    ["email", "Correo electrónico", "pi-envelope"],
                    ["phone", "Teléfono", "pi-phone"],
                    ["whatsapp", "WhatsApp", "pi-whatsapp"],
                  ].map(([method, label, icon]) => (
                    <label key={method} className={`account-method-chip ${contactMethods.includes(method) ? "is-selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={contactMethods.includes(method)}
                        onChange={() => toggleContactMethod(method)}
                      />
                      <i className={`pi ${icon}`} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              {(contactMethods.includes("phone") || contactMethods.includes("whatsapp")) && (
                <div className="account-form-grid account-form-grid--single">
                  <label>
                    Celular
                    <input
                      type="tel"
                      placeholder="Ej: 300 123 4567"
                      value={profileForm.phone}
                      onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                    />
                  </label>
                </div>
              )}
              <div className="account-preferences">
                {preferenceOptions.map(([key, label]) => (
                  <label key={key} className="account-switch">
                    <input
                      type="checkbox"
                      checked={preferences[key]}
                      onChange={(event) => setPreferences((current) => ({ ...current, [key]: event.target.checked }))}
                    />
                    <span />
                    {label}
                  </label>
                ))}
              </div>
              <button className="account-primary-btn" disabled={saving} type="submit">
                <i className="pi pi-save" />
                Guardar cambios
              </button>
            </form>
          )}

          <section className="account-participation">
            <header>
              <i className="pi pi-users" />
              <h2>Mi participación</h2>
            </header>
            <div className="account-participation-grid">
              <ParticipationCard icon="pi-heart" title="Voluntariado" value={participation.volunteerCount} detail="actividades" tone="purple" />
              <ParticipationCard icon="pi-calendar" title="Eventos" value={participation.eventsCount} detail="asistencias" tone="teal" />
              <ParticipationCard icon="pi-megaphone" title="Campañas" value={participation.campaignsCount} detail="apoyadas" tone="gold" />
              <ParticipationCard icon="pi-bookmark" title="Padrino permanente" value={participation.sponsorCount} detail="registros" tone="rose" />
            </div>
          </section>

          <div className="account-lower-grid">
            <section className="account-activity-card">
              <header>
                <i className="pi pi-clock" />
                <h2>Mi actividad</h2>
              </header>
              <div className="account-timeline">
                {activity.length === 0 ? (
                  <p className="account-empty">Aún no hay actividad registrada.</p>
                ) : (
                  activity.slice(0, 3).map((activityItem) => (
                    <article key={activityItem.id}>
                      <i className="pi pi-calendar" />
                      <div>
                        <strong>{activityItem.description || "Movimiento registrado"}</strong>
                        <span>{activityItem.action}</span>
                      </div>
                      <small>{formatDateTime(activityItem.timestamp)}</small>
                    </article>
                  ))
                )}
              </div>
              <Link className="account-text-link" to="/mi-cuenta">Ver toda mi actividad <i className="pi pi-arrow-right" /></Link>
            </section>

            <section className="account-security-card">
              <header>
                <i className="pi pi-shield" />
                <h2>Seguridad</h2>
              </header>
              <div className="account-security-message">
                <i className="pi pi-lock" />
                <strong>Protegemos tu información</strong>
                <span>Mantén tu cuenta segura actualizando tu contraseña regularmente.</span>
              </div>
              <form className="account-password-form" onSubmit={handlePasswordSubmit}>
                {user?.has_usable_password && (
                  <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={passwordForm.current_password}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, current_password: event.target.value }))}
                  />
                )}
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={passwordForm.new_password}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, new_password: event.target.value }))}
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={passwordForm.confirm_password}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, confirm_password: event.target.value }))}
                />
                <button className="account-primary-btn" disabled={saving} type="submit">
                  <i className="pi pi-lock" />
                  {user?.has_usable_password ? "Cambiar contraseña" : "Crear contraseña"}
                </button>
              </form>
              <div className="account-google-mini">
                <span>{profile?.has_google ? profile.google_email : "Vincula una cuenta de Google"}</span>
                <GoogleAuthButton
                  mode="link"
                  variant="account"
                  label={profile?.has_google ? "Cambiar cuenta de Google" : "Vincular Google"}
                  onCredential={handleGoogleCredential}
                />
              </div>
              <button className="account-logout-btn" type="button" onClick={handleLogout}>
                <i className="pi pi-sign-out" />
                Cerrar sesión
              </button>
            </section>

            <section className="account-impact-card">
              <header>
                <i className="pi pi-heart" />
                <h2>Tu impacto</h2>
              </header>
              <p>Gracias a tu compromiso, seguimos transformando vidas.</p>
              <div className="account-impact-list">
                <span><i className="pi pi-users" /> <strong>{participation.eventsCount}</strong> eventos</span>
                <span><i className="pi pi-megaphone" /> <strong>{participation.campaignsCount}</strong> campañas</span>
                <span><i className="pi pi-heart-fill" /> <strong>{donationSummary.completed_count ?? 0}</strong> donaciones</span>
              </div>
              <strong className="account-impact-total">{formatCurrency(donationSummary.total_completed)}</strong>
            </section>
          </div>

          {showRoles && (
            <section className="account-internal-card">
              <header>
                <i className="pi pi-key" />
                <div>
                  <h2>Roles y permisos</h2>
                  <p>Visible solo para cuentas con acceso interno.</p>
                </div>
              </header>
              <div className="account-role-list">
                {(user?.is_superuser ? ["Administrador General"] : roles).map((roleName: string) => (
                  <span key={roleName}>{roleName}</span>
                ))}
              </div>
              <div className="account-permission-list">
                {permissions.slice(0, 8).map((permission, index) => (
                  <small key={permission.id ?? `${permission.codename}-${index}`}>
                    {permission.name || permission.codename}
                  </small>
                ))}
              </div>
            </section>
          )}

          {volunteer && (
            <section className="account-internal-card">
              <header>
                <i className="pi pi-heart" />
                <div>
                  <h2>Mi voluntariado</h2>
                  <p>{volunteer.status_label} - {volunteer.support_area_label}</p>
                </div>
              </header>
              <div className="account-volunteer-list">
                {volunteer.availabilities.map((availability) => (
                  <span key={availability.id}>{dayLabels[availability.day_of_week]}: {availability.start_time} - {availability.end_time}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="account-bottom-banner">
          <img src={publicAssets.heartLogo} alt="" aria-hidden="true" />
          <div>
            <strong>Juntas transformamos metas en realidades.</strong>
            <span>Gracias por ser parte de esta misión.</span>
          </div>
          <Link to="/nosotros">
            <i className="pi pi-heart" />
            Conocer más sobre la fundación
            <i className="pi pi-arrow-right" />
          </Link>
        </section>
      </section>
    </PublicLayout>
  );
}
