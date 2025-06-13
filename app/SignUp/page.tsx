"use client";

import type React from "react";

import { useState, useTransition } from "react";

import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import PasswordInput from "@/components/passwordInput";
import AuthLayout from "@/components/AuthLayout";

// Schema
const formSchema = z.object({
  username: z.string().min(1, "Usernamename is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password should be at least 6 characters"),
});

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const res = await axios.post("/api/SignUp", {
          username: values.username,
          email: values.email,
          password: values.password,
        });

        if (res.data.success) {
          router.push("/Login");

          toast.success("Sign Up Successfull", {
            position: "bottom-right",
            duration: 3000,
            className: "bg-green-700 text-white border border-green-600",
            style: {
              backgroundColor: "#285943",
              color: "white",
              border: "1px solid #3e5692",
            },
          });
        } else if (!res.data.success) {
          toast.success("Sign Up Failed", {
            description: res.data.message,
            position: "bottom-right",
            duration: 3000,
            className: "bg-red-700 text-white border border-red-600",
            style: {
              backgroundColor: "#C1292E",
              color: "white",
              border: "1px solid #3e5692",
            },
          });
        }
      } catch (error: any) {
        toast.success("Sign Up Failed", {
          description: error.message,
          position: "bottom-right",
          duration: 3000,
          className: "bg-red-700 text-white border border-red-600",
          style: {
            backgroundColor: "#C1292E",
            color: "white",
            border: "1px solid #3e5692",
          },
        });
        console.error("Signup error", error);
      }
    });
  };

  return (
    <AuthLayout
      header="Create Account"
      title="Join our leave management system"
      navigator="/Login"
      navigateTitle="Already have an account?"
      navigateTo="Sign in"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your Username"
                      {...field}
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} className="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {isPending ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              <div className="flex gap-2 items-center">Create Account</div>
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
