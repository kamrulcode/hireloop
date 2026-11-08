"use client";

import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  ...props
}: {
  id: string;
  label: string;
  icon: typeof Mail;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-200">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
        <Input
          id={id}
          className="h-10 bg-[#0d0d0d] pl-9 dark:bg-[#0d0d0d]"
          {...props}
        />
      </div>
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const users = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;
    console.log(users);

    if (isLogin) {
      const { data, error } = await authClient.signIn.email({
        email: users.email,
        password: users.password,
        callbackURL: "/",
      });
      console.log(data, error);
    } else {
      const { data, error } = await authClient.signUp.email({
        name: users.name,
        email: users.email,
        password: users.password,
        callbackURL: "/",
      });
      console.log(data, error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="starfield absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(79,70,229,0.28),transparent)]"
      />

      <Card className="relative w-full max-w-md gap-6 rounded-2xl border border-white/10 bg-[#111111]/85 p-8 ring-white/10 backdrop-blur">
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo />
          <h1 className="font-heading text-2xl font-semibold text-white">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-zinc-500">
            {isLogin
              ? "Sign in to pick up where you left off."
              : "Start landing interviews in days, not months."}
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <Field
              id="name"
              label="Full name"
              name="name"
              icon={User}
              type="text"
              placeholder="Ada Lovelace"
              autoComplete="name"
            />
          )}
          <Field
            id="email"
            label="Email"
            name="email"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-200"
              >
                Password
              </label>
              {isLogin && (
                <Link
                  href="/login"
                  className="text-xs text-zinc-500 transition-colors hover:text-violet-400"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="h-10 bg-[#0d0d0d] pl-9 dark:bg-[#0d0d0d]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-1 h-11 w-full rounded-lg bg-[#4f46e5] text-sm font-medium text-white hover:bg-[#5b5bf0]"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1 bg-white/10" />
          <span className="text-xs text-zinc-500">or</span>
          <Separator className="flex-1 bg-white/10" />
        </div>

        <Button
          variant="outline"
          className="h-11 w-full gap-2 rounded-lg border-white/15 bg-transparent text-sm font-medium text-white hover:bg-white/5 hover:text-white dark:bg-transparent dark:hover:bg-white/5"
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="text-center text-sm text-zinc-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isLogin ? "/signup" : "/login"}
            className="font-medium text-violet-400 transition-colors hover:text-violet-300"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </Card>
    </div>
  );
}
