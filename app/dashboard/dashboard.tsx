"use client";
import DashboardLoader from "@/components/DashboardLoader";
import { setOrganization } from "@/utils/DataSlice";
import { RootState } from "@/utils/Store";
import axios from "axios";
import React, { useEffect, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Building2, Plus, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

function Dashboard() {
  const naviagate = useRouter();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);
  const [isPending, startTransition] = useTransition();
  const organizations = useSelector(
    (state: RootState) => state.dataSlice.organization
  );

  const dispatch = useDispatch();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await axios.get(`/api/getOrganizations?id=${userInfo.id}`);
        const { success, message, organizations } = res.data;

        if (!success) {
          toast.error(message, {
            position: "bottom-right",
            duration: 3000,
            className: "bg-red-700 text-white border border-red-600",
            style: {
              backgroundColor: "#C1292E",
              color: "white",
              border: "1px solid #3e5692",
            },
          });
          return;
        }

        dispatch(setOrganization(organizations));
      } catch (error: any) {
        console.error("Error fetching organizations:", error);
        toast.error("Failed to fetch organizations", {
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
    });
  }, []);

  if (isPending) {
    return <DashboardLoader />;
  }
  return (
    <div
      className="flex justify-center items-center p-3
    "
    >
      {" "}
      {/* Main Content */}
      {/* // checking Organization.length === 0 or not */}
      {Object.keys(organizations).length === 0 ? (
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="w-full max-w-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl mb-6 shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                You're not part of any organization
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                To start managing your leave requests, you need to either create
                a new organization or join an existing one.
              </p>

              <div className="flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
                  <Plus className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Create Organization
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Start fresh with your own organization
                  </p>
                  <Button
                    onClick={() =>
                      naviagate.push("/dashboard/createOrganization")
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-xl"
                  >
                    Create New
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}

export default Dashboard;
