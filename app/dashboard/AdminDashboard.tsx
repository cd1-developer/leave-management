"use client";
import React, { useEffect, useTransition } from "react";
import { Clock, Calendar, Users, Building2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TeamMemberCompo from "./TeamMemberCompo";
import LeaveTypeCompo from "./leaveTypeCompo";
import LeaveRequestCompo from "./LeaveRequestCompo";
import SettingCompo from "./SettingCompo";
const TABS = [
  { tab: "Team Memebers", element: <TeamMemberCompo /> },
  { tab: "Leave Types", element: <LeaveTypeCompo /> },
  { tab: "Leave Requests", element: <LeaveRequestCompo /> },
  { tab: "Settings", element: <SettingCompo /> },
];
function AdminDashboard() {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {}, []);
  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:p-10 lg:px-8 py-4 sm:py-8">
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
        <Tabs defaultValue="overview" className="mb-6 sm:mb-8">
          <ScrollArea className=" rounded-md  p-4  w-98 md:w-full">
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
            <TabsContent value={tabInfo.tab} className="mt-6 ml-5" key={index}>
              {tabInfo.element}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </>
  );
}

export default AdminDashboard;
