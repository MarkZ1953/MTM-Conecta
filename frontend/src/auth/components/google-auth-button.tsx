import { AuthContext, getPostLoginPath } from "@/auth";
import { toast } from "@/components";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../auth.api";

type GoogleAuthButtonProps = {
  mode: "login" | "register";
};

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number;
            },
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const loadGoogleScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("No se pudo cargar Google.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Google."));
    document.head.appendChild(script);
  });

const getErrorMessage = (responseData: any) => {
  if (!responseData) return "No se pudo continuar con Google.";
  if (responseData.message) return responseData.message;
  return "No se pudo continuar con Google.";
};

export function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useContext(AuthContext);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    let isMounted = true;

    loadGoogleScript()
      .then(() => {
        if (!isMounted || !buttonRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (!response.credential) {
              toast.error("Google no entregó una credencial válida.");
              return;
            }

            try {
              const { status, data } = await authAPI.googleAuth({
                credential: response.credential,
              });

              if (status >= 200 && status < 300) {
                const refreshedUser = await refresh();
                const user = refreshedUser ?? data?.user;
                toast.success(data?.created ? "Cuenta creada con Google." : "Inicio con Google exitoso.");
                navigate(getPostLoginPath(user));
                return;
              }

              throw new Error(getErrorMessage(data));
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "No se pudo continuar con Google.");
            }
          },
        });

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: mode === "register" ? "signup_with" : "signin_with",
          shape: "pill",
          logo_alignment: "left",
          width: Math.min(buttonRef.current.clientWidth || 360, 420),
        });
        setIsReady(true);
      })
      .catch(() => {
        if (isMounted) {
          toast.error("No se pudo cargar el botón de Google.");
        }
      });

    return () => {
      isMounted = false;
      window.google?.accounts?.id?.cancel();
    };
  }, [mode, navigate, refresh]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button className="google-auth-placeholder" type="button" disabled>
        <i className="pi pi-google" />
        Configura Google Client ID
      </button>
    );
  }

  return (
    <div className="google-auth-shell" aria-busy={!isReady}>
      {!isReady && (
        <span className="google-auth-loading">
          <i className="pi pi-spin pi-spinner" />
          Cargando Google...
        </span>
      )}
      <div ref={buttonRef} className="google-auth-button" />
    </div>
  );
}
