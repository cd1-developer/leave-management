import Link from "next/link";
import { Calendar, ArrowRight, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Doogal-style background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-100/40 to-slate-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-bl from-indigo-200/20 to-blue-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl mb-6 shadow-lg">
              <Calendar className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4">
              Leave Management System
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Streamline your leave requests, approvals, and tracking with our
              modern, secure platform designed for teams of all sizes.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <Shield className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-slate-600">
                Enterprise-grade security with reliable uptime for your peace of
                mind.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <Clock className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Real-time Tracking
              </h3>
              <p className="text-slate-600">
                Track leave balances, requests, and approvals in real-time.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <Users className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Team Collaboration
              </h3>
              <p className="text-slate-600">
                Seamless collaboration between employees and managers.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/Login">
              <Button className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/SignUp">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-200"
              >
                Create Account
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 text-sm text-slate-500">
            <p>Trusted by teams worldwide • Secure • Professional</p>
          </div>
        </div>
      </div>
    </div>
  );
}
