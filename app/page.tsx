import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirigimos por defecto al Login si no hay sesión (simulado)
  redirect("/login");
}
