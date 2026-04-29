"use client";

import {
  Button,
  Card,
  HelperText,
  Checkbox,
  Label,
  TextInput,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
interface IUserDate {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const [colorInvaildInputeState, setColorInvaildInputeState] = useState<
    string | undefined
  >();

  const [backendErrorMessage, setBackendErrorMessage] = useState<string>();

  const handleColorInvalidInputReset = () => {
    setColorInvaildInputeState(undefined);
  };

  const router = useRouter();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as IUserDate;

    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (err: any) {
      setBackendErrorMessage(err.message);
      setColorInvaildInputeState("failure");
    }
  };

  return (
    <Card>
      <form
        className="flex max-w-lg min-w-md flex-col gap-4"
        onSubmit={handleLogin}
        onChange={handleColorInvalidInputReset}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Your email</Label>
          </div>
          <TextInput
            id="email1"
            type="email"
            name="email"
            placeholder="name@flowbite.com"
            required
            color={colorInvaildInputeState}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1">Your password</Label>
          </div>
          <TextInput
            id="password1"
            name="password"
            type="password"
            required
            color={colorInvaildInputeState}
          />
        </div>
        {colorInvaildInputeState && (
          <HelperText color="failure">{backendErrorMessage}</HelperText>
        )}
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button type="submit">Submit</Button>
      </form>
      <HelperText>
        You don't have an account yet?
        <a
          href="/register"
          className="ml-1 font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          Register here
        </a>
        .
      </HelperText>
    </Card>
  );
}
