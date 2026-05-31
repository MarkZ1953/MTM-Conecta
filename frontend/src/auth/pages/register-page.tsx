import { publicAssets } from "@/core/pages/public-home/cloudinary-assets";
import { PublicNavbar } from "@/core/pages/public-home/public-navbar";
import { RegisterForm } from "../components/forms/register/register-form";
import "../styles/auth.css";

export function RegisterPage() {
  return (
    <main className="auth-public-page auth-image-page auth-image-page--register">
      <PublicNavbar />

      <section
        className="auth-image-stage"
        style={{ backgroundImage: `url(${publicAssets.login})` }}
      >
        <div className="auth-image-card auth-image-card--register">
          <div className="auth-account-card-heading">
            <span className="auth-account-pill auth-account-pill--rose">
              <i className="pi pi-heart-fill" aria-hidden="true" /> Comunidad
              MTM
            </span>
          </div>
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
