import { redirect } from "next/navigation"

export default function AdminPanelRedirect() {
  redirect("/admin-panel/dashboard")
}
