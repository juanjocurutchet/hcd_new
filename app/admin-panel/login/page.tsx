import { redirect } from "next/navigation"

export default function LoginPage() {
  redirect("/admin/login")
  return null
}