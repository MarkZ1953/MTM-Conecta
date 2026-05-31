import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookieConsent } from "./components";
import { AuthProvider } from "./auth";
import { AppRouter } from "./router";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
          <CookieConsent />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
