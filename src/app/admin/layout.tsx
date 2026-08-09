import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import AuthGuard from "@/components/admin/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 bg-slate-100 min-h-screen">
          <Header />

          <div className="p-8">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
