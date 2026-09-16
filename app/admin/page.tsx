import { isAdminAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Dashboard } from "@/components/admin/Dashboard";

export const metadata = {
  title: "برنامه‌ی قرار — مدیریت",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="paper-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-14 sm:px-6">
        {authed ? <Dashboard /> : <LoginForm />}
      </main>
    </div>
  );
}
