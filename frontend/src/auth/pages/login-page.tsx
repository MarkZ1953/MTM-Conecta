import { publicAssets } from "@/core/pages/public-home/cloudinary-assets";
import { PublicNavbar } from "@/core/pages/public-home/public-navbar";
import { LoginForm } from "../components";
import "../styles/auth.css";

export function LoginPage() {
  return (
    <main className="auth-public-page auth-image-page auth-image-page--login">
      <PublicNavbar />

      <section
        className="auth-image-stage"
        style={{ backgroundImage: `url(${publicAssets.login})` }}
      >
        <div className="auth-image-card auth-image-card--login">
          <div className="auth-account-card-heading">
            <span className="auth-account-pill">
              <i className="pi pi-lock" aria-hidden="true" /> Acceso seguro
            </span>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
