import { RegisterForm } from "@/src/components/RegisterForm";
import { Logo } from "@/src/components/Logo";

export default function Register() {
  return (
    <main className="flex grow flex-col items-center justify-center gap-5 bg-white dark:bg-gray-900">
      <Logo />
      <RegisterForm />
    </main>
  );
}
