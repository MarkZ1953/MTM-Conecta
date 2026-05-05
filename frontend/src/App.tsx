import { AuthProvider } from "./auth";
import { AppRouter } from "./router";

export default function App() {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </>
  );
}
