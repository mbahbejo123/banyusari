import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../login/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();
  return <div className="admin-shell"><AdminSidebar /><div className="admin-main"><header className="admin-topbar"><div><strong>{profile.full_name || "Administrator"}</strong><div className="muted">{profile.role}</div></div><form action={logoutAction}><button className="button danger small" type="submit">Keluar</button></form></header><div className="admin-content">{children}</div></div></div>;
}
