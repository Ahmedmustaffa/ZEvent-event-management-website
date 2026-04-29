import { LoginForm } from "@/src/components/LoginForm";
import { Logo } from "@/src/components/Logo";

export default function Login() {
  return (
    <main className="flex grow flex-col items-center justify-center gap-5 bg-white dark:bg-gray-900">
      <Logo />
      <LoginForm />
    </main>
  );
}
