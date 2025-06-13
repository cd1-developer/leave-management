"use client";
import React from "react";
import { Calendar, LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useSignOut } from "@/hooks/useSignout";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
function Navbar() {
  const signOutHandler = useSignOut();
  const session = useSession();
  const { status } = session;
  const navigate = useRouter();
  const pathname = usePathname();
  const { userInfo } = useUserData();

  return (
    <header className="sticky top-0 z-50 bg-indigo-50 backdrop-blur-sm border-b border-white/20 shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg mr-3">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              Leave Management
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {status === "authenticated" ? (
              <>
                <div className="flex gap-3 items-center ">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white font-semibold text-lg">
                      {userInfo?.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button onClick={signOutHandler} variant="outline">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : !(pathname === "/Login" || pathname === "/SignUp") ? (
              <Button
                variant="outline"
                onClick={() => navigate.push("/Login")}
                className="w-full sm:w-auto h-10 px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-200"
              >
                <LogIn /> Sign In
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
