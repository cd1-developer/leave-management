import { OrgMember, setLeaveTypes } from "@/utils/DataSlice";
import { RootState } from "@/utils/Store";
import { ReportManager } from "@prisma/client";

import {
  Users,
  CircleAlert,
  CircleCheckBig,
  Clock,
  Calendar,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React, { useState, useEffect, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import TeamOverview from "./ReportManagerCompo/TeamOverview";
import MyLeave from "./ReportManagerCompo/MyLeave";
import axios from "axios";
import { toast } from "sonner";
import DashboardLoader from "@/components/DashboardLoader";

function ReportManagerDashboard() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);
  const organization = useSelector(
    (state: RootState) => state.dataSlice.organization
  );

  const reportManagers = useSelector(
    (state: RootState) => state.dataSlice.reportManagers
  );

  const reportManager = reportManagers.find(
    (manager: ReportManager) => manager.userId === userInfo.id
  );

  //? Tabs Data
  const TABS = [
    {
      tab: "Team Members",
      compo: (
        <TeamOverview members={(reportManager?.members || []) as OrgMember[]} />
      ),
      icon: <Users />,
    },
    {
      tab: "My Leave",
      compo: <MyLeave />,
      icon: <Calendar />,
    },
  ];

  const [activeTab, setActiveTab] = useState(TABS[0].tab);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await axios.get(
          `/api/getOrgLeaveTypes?organizationId=${organization.id}`
        );
        const { success, message, leaveTypes } = res.data;
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
        }
        dispatch(setLeaveTypes(leaveTypes));
      } catch (error: any) {
        console.log(`Error in getting leaves ERROR ${error.message}`);
        toast.error("Error in getting leaves ERROR", {
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full my-8 head">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="rounded-sm p-5 shadow-[5px_5px_5px_rgba(0,0,0,0.1)] md:col-span-2 lg:col-span-1 bg-white card">
            <div className="flex items-center justify-between title">
              <h1 className="font-gilSemiBold">Team Members</h1>
              <i>
                <Users size={16} className="text-blue-700" />
              </i>
            </div>
            <div className="text-2xl font-gilBold mt-2 count">3</div>
            <div>
              <p className="text-[0.8rem] font-gilSemiBold text-gray-500">
                Under your management
              </p>
            </div>
          </div>
          <div className="rounded-sm p-5 shadow-[5px_5px_5px_rgba(0,0,0,0.1)] md:col-span-2 lg:col-span-1 bg-white card">
            <div className="flex items-center justify-between title">
              <h1 className="font-gilSemiBold">Pending Approvals</h1>
              <i>
                <CircleAlert size={16} className="text-red-600" />
              </i>
            </div>
            <div className="text-2xl font-gilBold mt-2 count">3</div>
            <div>
              <p className="text-[0.8rem] font-gilSemiBold text-gray-500">
                Awaiting your review
              </p>
            </div>
          </div>
          <div className="rounded-sm p-5 shadow-[5px_5px_5px_rgba(0,0,0,0.1)] md:col-span-2 lg:col-span-1 bg-white card">
            <div className="flex items-center justify-between title">
              <h1 className="font-gilSemiBold">Approved This Month</h1>
              <i>
                <CircleCheckBig size={16} className="text-green-600" />
              </i>
            </div>
            <div className="text-2xl font-gilBold mt-2 count">1</div>
            <div>
              <p className="text-[0.8rem] font-gilSemiBold text-gray-500">
                Team leave requests
              </p>
            </div>
          </div>
          <div className="rounded-sm p-5 shadow-[5px_5px_5px_rgba(0,0,0,0.1)] md:col-span-2 lg:col-span-1 bg-white card">
            <div className="flex items-center justify-between title">
              <h1 className="font-gilSemiBold">Your Pending Leaves</h1>
              <i>
                <Clock size={16} className="text-purple-600" />
              </i>
            </div>
            <div className="text-2xl font-gilBold mt-2 count">1</div>
            <div>
              <p className="text-[0.8rem] font-gilSemiBold text-gray-500">
                Awaiting approval
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 tabs">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {TABS.map((tab, index) => (
              <TabsTrigger
                value={tab.tab}
                key={index}
                className={`${
                  activeTab === tab.tab ? "opacity-100" : "opacity-50"
                }`}
              >
                <i className="text-gray-800">{tab.icon}</i>
                <h2 className="font-gilSemiBold text-gray-800">{tab.tab}</h2>
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab, index) => (
            <TabsContent value={tab.tab} key={index}>
              {tab.compo}
            </TabsContent>
          ))}

          {/* <TabsContent value="team-member"></TabsContent> */}
        </Tabs>
      </div>
    </section>
  );
}

export default ReportManagerDashboard;
