"use client";
import React, { useEffect, useTransition } from "react";
import { Clock, Calendar, Users, Building2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TeamMemberCompo from "./TeamMemberCompo";
import LeaveTypeCompo from "./leaveTypeCompo";
import LeaveRequestCompo from "./LeaveRequestCompo";
import SettingCompo from "./SettingCompo";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/Store";
import { setOrgMembers, setReportManagers } from "@/utils/DataSlice";
import DashboardLoader from "@/components/DashboardLoader";
import Teams from "./Teams";

const TABS = [
  { tab: "Team Memebers", element: <TeamMemberCompo /> },
  { tab: "Leave Types", element: <LeaveTypeCompo /> },
  { tab: "Leave Requests", element: <LeaveRequestCompo /> },
  {
    tab: "Teams",
    element: <Teams />,
  },
  { tab: "Settings", element: <SettingCompo /> },
];

function AdminDashboard() {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const organization = useSelector(
    (state: RootState) => state.dataSlice.organization
  );

  const isFetch = useSelector((state: RootState) => state.dataSlice.isFetch);

  useEffect(() => {
    startTransition(async () => {
      try {
        // 1. Fetch organization members
        const membersRes = await axios.get(
          `/api/getOrgMembers?organizationId=${organization?.id}`
        );
        const { orgMemebers } = membersRes.data;
        dispatch(setOrgMembers(orgMemebers));

        // 2. Fetch report managers
        const managerRes = await axios.get(
          `/api/report-manager/get-report-manager?organizationId=${organization?.id}`
        );
        const { reportManagers } = managerRes.data;
        dispatch(setReportManagers(reportManagers)); // You should have this action in your Redux slice
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
  }, [isFetch]);

  if (isPending) {
    return <DashboardLoader />;
  }

  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:p-10 lg:px-8 py-4 sm:py-8 container">
        <div className="grid grid-cols-1 px-6 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Stats Cards */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Available Leave
                </p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  20 days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-3" />
              <div>
                <p className="text-xs sm:text-sm text-slate-600">Used Leave</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  5 days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Pending Requests
                </p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  2
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-xs sm:text-sm text-slate-600">Team Size</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  12
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Dashboard Sections */}
        <Tabs defaultValue="Team Memebers" className="mb-6 sm:mb-8">
          <ScrollArea className=" rounded-md  p-4  w-82  mx-auto md:w-full">
            <TabsList className=" backdrop-blur-sm border border-white/20 w-auto inline-flex gap-2">
              {TABS.map((tabInfo, index) => (
                <TabsTrigger
                  value={tabInfo.tab}
                  key={index}
                  className="text-xs sm:text-sm"
                >
                  {tabInfo.tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>{" "}
          {TABS.map((tabInfo, index) => (
            <TabsContent value={tabInfo.tab} className="mt-6 px-3" key={index}>
              {tabInfo.element}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </>
  );
}

export default AdminDashboard;
