import { Suspense } from "react";
import { Lock, Loader2 } from "lucide-react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

function LoginSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
          <Lock className="h-6 w-6 text-[hsl(var(--foreground))]" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-[hsl(var(--foreground))]">
          Admin Login
        </h1>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          เข้าสู่ระบบจัดการเว็บไซต์
        </p>
      </div>
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--muted-foreground))]" />
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<LoginSkeleton />}>
        <div className="w-full max-w-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
              <Lock className="h-6 w-6 text-[hsl(var(--foreground))]" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-[hsl(var(--foreground))]">
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              เข้าสู่ระบบจัดการเว็บไซต์
            </p>
          </div>
          <LoginForm />
        </div>
      </Suspense>
    </main>
  );
}
