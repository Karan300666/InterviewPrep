"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        await api.post("/api/auth/sign-up", {
          name,
          email,
          password,
        });
        toast.success("Account created successfully.");
        router.push("/");
      } else {
        const { email, password } = values;
        await api.post("/api/auth/sign-in", {
          email,
          password,
        });
        toast.success("Sign in successfully.");
        router.push("/");
      }
    } catch (error) {
      toast.error(`There was an error: ${error.message}`);
    }
  }

  function onError() {
    const firstError = Object.values(form.formState.errors)[0];
    const message = firstError?.message || "Please fill the form correctly.";
    toast.error(message);
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="">
      <div className="flex min-h-screen  items-center justify-center  px-4">
        <Card className="card-border lg:min-w-[400px] bg-dark-100 max-w-md py-10  ">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center">
              {isSignIn ? "Sign in" : "Sign up"}
            </CardTitle>
            <CardDescription className="py-4">
              {isSignIn
                ? "Enter your details below to sign in to your account"
                : "Enter your details below to Sing up to your account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="example"
                    {...form.register("name")}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  {...form.register("email")}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="*****"
                  {...form.register("password")}
                />
              </div>

              <Button className="w-full" type="submit">
                {isSignIn ? "Sign in" : "Create an account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {isSignIn ? "Not have an account? " : "Have an account? "}
                <Link
                  href={isSignIn ? "/sign-up" : "/sign-in"}
                  className=" hover:underline text-blue-400"
                >
                  {isSignIn ? "Create account" : "Sign in"}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
