import { LoginForm } from "@/features/auth/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supervision Login",
  description: "Secure login for Dubai real estate sales operations and supervision",
};

export default function LoginPage() {
  return <LoginForm />;
}
