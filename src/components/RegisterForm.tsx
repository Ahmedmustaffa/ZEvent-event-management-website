"use client";
import {
  Card,
  Button,
  HelperText,
  Checkbox,
  Label,
  TextInput,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IUserDate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatedPassword?: string;
  termsAndConditions?: string;
}

export function RegisterForm() {
  const router = useRouter();

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as IUserDate;

    if (data.password.length < 8) {
      setcolorPasswordLengthState("failure");
      return;
    }
    if (data.password !== data.repeatedPassword) {
      setcolorPasswordMissMatchState("failure");
      return;
    }
    const termsAndConditions = formData.has("termsAndConditions");
    if (!termsAndConditions) {
      setcolorTermsAndConditionsState("failure");
      return;
    }

    delete data.repeatedPassword;
    delete data.termsAndConditions;

    const response = await fetch("http://localhost:5000/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 201) {
      router.push("/login");
    }
  };

  const [colorPasswordMissMatchState, setcolorPasswordMissMatchState] =
    useState<string | undefined>();

  const [colorPasswordLengthState, setcolorPasswordLengthState] = useState<
    string | undefined
  >();

  const [colorTermsAndConditionsState, setcolorTermsAndConditionsState] =
    useState<string | undefined>();

  const handlePasswordChange = () => {
    setcolorPasswordMissMatchState(undefined);
    setcolorPasswordLengthState(undefined);
  };

  const handleTermsAndConditionsChange = () => {
    setcolorTermsAndConditionsState(undefined);
  };

  return (
    <Card>
      <form
        className="flex max-w-md min-w-md flex-col gap-4"
        onSubmit={handleRegister}
      >
        <div className="flex gap-4">
          <div className="grow">
            <div className="mb-2 block">
              <Label htmlFor="first-name">First name</Label>
            </div>
            <TextInput
              id="first-name"
              name="firstName"
              type="text"
              required
              minLength={3}
              shadow
            />
          </div>
          <div className="grow">
            <div className="mb-2 block">
              <Label htmlFor="last-name">Last name</Label>
            </div>
            <TextInput
              id="last-name"
              name="lastName"
              type="text"
              required
              minLength={3}
              shadow
            />
          </div>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2">Your email</Label>
          </div>
          <TextInput
            id="email2"
            type="email"
            name="email"
            placeholder="email@gmail.com"
            required
            shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password">Your password</Label>
          </div>
          <TextInput
            id="password"
            type="password"
            name="password"
            required
            shadow
            color={colorPasswordMissMatchState || colorPasswordLengthState}
            onChange={handlePasswordChange}
          />
          {colorPasswordLengthState && (
            <HelperText color={colorPasswordLengthState}>
              Password must be at least 8 characters.
            </HelperText>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="repeat-password">Repeat password</Label>
          </div>
          <TextInput
            id="repeat-password"
            name="repeatedPassword"
            type="password"
            required
            shadow
            color={colorPasswordMissMatchState}
            onChange={handlePasswordChange}
          />
          {colorPasswordMissMatchState && (
            <HelperText color={colorPasswordMissMatchState}>
              The password and the repeated password must be the same.
            </HelperText>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="agree"
            name="termsAndConditions"
            onChange={handleTermsAndConditionsChange}
          />
          <Label htmlFor="agree" className="flex">
            I agree with the&nbsp;
            <Link
              href="#"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              terms and conditions
            </Link>
          </Label>
        </div>
        {colorTermsAndConditionsState && (
          <HelperText color={colorTermsAndConditionsState}>
            You must agree with the terms and conditions.
          </HelperText>
        )}
        <Button type="submit">Register new account</Button>
      </form>
      <HelperText>
        You already have an account?
        <a
          href="/login"
          className="ml-1 font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          Login here
        </a>
        .
      </HelperText>
    </Card>
  );
}
