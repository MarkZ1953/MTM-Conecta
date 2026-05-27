import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmailEditor, type EditorRef, type EmailEditorProps } from "react-email-editor";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { toast } from "@/components";
import { campaignsAPI } from "./campaigns.api";
import { campaignTemplatesAPI } from "./campaign-templates.api";
import type {
  CampaignContentType,
  CampaignPayload,
  CampaignRecipientGroup,
  CampaignTemplate,
} from "./campaigns.types";
import "@/components/ui/resource-page.css";

// Project ID de Unlayer (opcional): si se configura, habilita la galería de
// plantillas profesionales de Unlayer dentro del editor.
const UNLAYER_PROJECT_ID = import.meta.env.VITE_UNLAYER_PROJECT_ID;
const editorOptions = UNLAYER_PROJECT_ID
  ? { projectId: Number(UNLAYER_PROJECT_ID) }
  : undefined;

const contentTypeOptions = [
  { label: "Diseñar plantilla (editor visual)", value: "BUILDER" },
  { label: "Subir imagen", value: "IMAGE" },
  { label: "Subir PDF", value: "PDF" },
];

const recipientOptions = [
  { label: "Donantes", value: "DONORS" },
  { label: "Acudientes", value: "GUARDIANS" },
  { label: "Usuarios", value: "USERS" },
  { label: "Todos (donantes + acudientes)", value: "ALL" },
];

export const CampaignFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const emailEditorRef = useRef<EditorRef>(null);
  const designToLoad = useRef<unknown>(null);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Campos del formulario
  const [subject, setSubject] = useState("");
  const [contentType, setContentType] = useState<CampaignContentType>("BUILDER");
  const [recipientGroup, setRecipientGroup] = useState<CampaignRecipientGroup>("DONORS");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [existingDocument, setExistingDocument] = useState<string | null>(null);

  // Plantillas reutilizables
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [pickOpen, setPickOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");

  // Cargar campaña en modo edición
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await campaignsAPI.getById({ id: Number(id) });
        setSubject(data.subject);
        setContentType(data.content_type);
        setRecipientGroup(data.recipient_group);
        setCtaText(data.cta_text ?? "");
        setCtaUrl(data.cta_url ?? "");
        setExistingImage(data.image);
        setExistingDocument(data.document);
        if (data.design_json) {
          try {
            designToLoad.current = JSON.parse(data.design_json);
          } catch {
            designToLoad.current = null;
          }
        }
      } catch {
        toast.error("No se pudo cargar la campaña.");
        navigate("/campaigns");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate]);

  // Cuando el editor está listo, carga el diseño guardado (si existe)
  const onEditorReady: EmailEditorProps["onReady"] = (unlayer) => {
    if (designToLoad.current) {
      unlayer.loadDesign(designToLoad.current as any);
    }
  };

  // ── Plantillas ──
  const openPickTemplate = async () => {
    try {
      const { data } = await campaignTemplatesAPI.getAll();
      setTemplates(data.results ?? []);
      setPickOpen(true);
    } catch {
      toast.error("No se pudieron cargar las plantillas.");
    }
  };

  const applyTemplate = (template: CampaignTemplate) => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer || !template.design_json) return;
    try {
      unlayer.loadDesign(JSON.parse(template.design_json));
      setPickOpen(false);
      toast.success(`Plantilla "${template.name}" cargada.`);
    } catch {
      toast.error("No se pudo cargar la plantilla.");
    }
  };

  const saveAsTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Ponle un nombre a la plantilla.");
      return;
    }
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    unlayer.exportHtml(async (data) => {
      const { design, html } = data;
      try {
        const res = await campaignTemplatesAPI.create({
          data: {
            name: templateName.trim(),
            design_json: JSON.stringify(design),
            html_content: html,
          },
        });
        if (res.status >= 200 && res.status < 300) {
          toast.success("Plantilla guardada.");
          setSaveOpen(false);
          setTemplateName("");
          return;
        }
        throw new Error("No se pudo guardar la plantilla.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo guardar la plantilla.");
      }
    });
  };

  const submit = async (extra: Partial<CampaignPayload>) => {
    const payload: CampaignPayload = {
      subject,
      content_type: contentType,
      recipient_group: recipientGroup,
      cta_text: ctaText,
      cta_url: ctaUrl,
      ...extra,
    };

    try {
      setSaving(true);
      const res = isEdit
        ? await campaignsAPI.update({ id: Number(id), data: payload })
        : await campaignsAPI.create({ data: payload });

      if (res.status >= 200 && res.status < 300) {
        toast.success(isEdit ? "Campaña actualizada." : "Campaña creada.");
        navigate("/campaigns");
        return;
      }
      throw new Error(res.data ? JSON.stringify(res.data) : "No se pudo guardar la campaña.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la campaña.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!subject.trim()) {
      toast.error("El asunto es obligatorio.");
      return;
    }

    if (contentType === "BUILDER") {
      const unlayer = emailEditorRef.current?.editor;
      if (!unlayer) {
        toast.error("El editor aún no está listo.");
        return;
      }
      unlayer.exportHtml((data) => {
        const { design, html } = data;
        submit({ html_content: html, design_json: JSON.stringify(design) });
      });
    } else if (contentType === "IMAGE") {
      if (!image && !existingImage) {
        toast.error("Debes subir una imagen.");
        return;
      }
      submit({ image: image ?? undefined });
    } else {
      if (!document && !existingDocument) {
        toast.error("Debes subir un PDF.");
        return;
      }
      submit({ document: document ?? undefined });
    }
  };

  if (loading) {
    return (
      <div className="rp" style={{ display: "grid", placeItems: "center", height: "60vh" }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: 28, color: "var(--rp-teal)" }} />
      </div>
    );
  }

  return (
    <div className="rp">
      {/* Header */}
      <div className="rp-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="rp-btn rp-btn-ghost" onClick={() => navigate("/campaigns")}>
            <i className="pi pi-arrow-left" style={{ fontSize: 13 }} /> Volver
          </button>
          <div>
            <h1 className="rp-title">{isEdit ? "Editar campaña" : "Nueva campaña"}</h1>
            <p className="rp-sub">Diseña el correo y elige a quién enviarlo.</p>
          </div>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={handleSave} disabled={saving}>
            <i className={`pi ${saving ? "pi-spin pi-spinner" : "pi-save"}`} style={{ fontSize: 13 }} />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* Configuración */}
      <div className="rp-card" style={{ padding: 22, marginBottom: 18 }}>
        <div className="grid formgrid p-fluid row-gap-3">
          <div className="field col-12 md:col-6">
            <label className="block mb-2 font-medium text-700">Asunto del correo</label>
            <InputText value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ej: ¡Conoce nuestra campaña!" className="w-full" />
          </div>
          <div className="field col-12 md:col-3">
            <label className="block mb-2 font-medium text-700">Tipo de contenido</label>
            <Dropdown value={contentType} options={contentTypeOptions} onChange={(e) => setContentType(e.value)} className="w-full" />
          </div>
          <div className="field col-12 md:col-3">
            <label className="block mb-2 font-medium text-700">Destinatarios</label>
            <Dropdown value={recipientGroup} options={recipientOptions} onChange={(e) => setRecipientGroup(e.value)} className="w-full" />
          </div>
          <div className="field col-12 md:col-6">
            <label className="block mb-2 font-medium text-700">Texto del botón (opcional)</label>
            <InputText value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Ej: Donar ahora" className="w-full" />
          </div>
          <div className="field col-12 md:col-6">
            <label className="block mb-2 font-medium text-700">Enlace del botón (opcional)</label>
            <InputText value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://..." className="w-full" />
          </div>
        </div>
      </div>

      {/* Área de contenido según el tipo */}
      {contentType === "BUILDER" && (
        <div className="rp-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 10, padding: "12px 16px", borderBottom: "1px solid var(--rp-line)" }}>
            <button className="rp-btn rp-btn-ghost" onClick={openPickTemplate}>
              <i className="pi pi-clone" style={{ fontSize: 13 }} /> Usar plantilla
            </button>
            <button className="rp-btn rp-btn-ghost" onClick={() => setSaveOpen(true)}>
              <i className="pi pi-bookmark" style={{ fontSize: 13 }} /> Guardar como plantilla
            </button>
          </div>
          <EmailEditor ref={emailEditorRef} onReady={onEditorReady} minHeight="65vh" options={editorOptions} />
        </div>
      )}

      {contentType === "IMAGE" && (
        <div className="rp-card" style={{ padding: 22 }}>
          <label className="block mb-2 font-medium text-700">Imagen del correo</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="w-full" />
          {existingImage && !image && (
            <div style={{ marginTop: 12 }}>
              <p className="text-500 mb-2">Imagen actual:</p>
              <img src={existingImage} alt="actual" style={{ maxWidth: 320, borderRadius: 8, border: "1px solid var(--rp-line)" }} />
            </div>
          )}
        </div>
      )}

      {contentType === "PDF" && (
        <div className="rp-card" style={{ padding: 22 }}>
          <label className="block mb-2 font-medium text-700">Documento PDF</label>
          <input type="file" accept="application/pdf" onChange={(e) => setDocument(e.target.files?.[0] ?? null)} className="w-full" />
          {existingDocument && !document && (
            <p className="text-500" style={{ marginTop: 12 }}>
              Ya hay un PDF cargado. Sube uno nuevo solo si quieres reemplazarlo.
            </p>
          )}
        </div>
      )}

      {/* Diálogo: elegir plantilla guardada */}
      <Dialog
        header="Usar una plantilla guardada"
        visible={pickOpen}
        onHide={() => setPickOpen(false)}
        modal
        draggable={false}
        className="w-11 sm:w-30rem"
      >
        {templates.length === 0 ? (
          <p className="text-700 m-0">
            Aún no hay plantillas guardadas. Diseña un correo y usa "Guardar como plantilla".
          </p>
        ) : (
          <div className="flex flex-column gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                className="rp-btn rp-btn-ghost"
                style={{ justifyContent: "flex-start", width: "100%" }}
                onClick={() => applyTemplate(t)}
              >
                <i className="pi pi-file" style={{ fontSize: 13 }} /> {t.name}
              </button>
            ))}
          </div>
        )}
      </Dialog>

      {/* Diálogo: guardar diseño actual como plantilla */}
      <Dialog
        header="Guardar como plantilla"
        visible={saveOpen}
        onHide={() => setSaveOpen(false)}
        modal
        draggable={false}
        className="w-11 sm:w-30rem"
        footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" severity="secondary" outlined onClick={() => setSaveOpen(false)} />
            <Button label="Guardar" icon="pi pi-save" onClick={saveAsTemplate} />
          </div>
        }
      >
        <label className="block mb-2 font-medium text-700">Nombre de la plantilla</label>
        <InputText
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Ej: Boletín mensual"
          className="w-full"
        />
      </Dialog>
    </div>
  );
};
