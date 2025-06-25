import TeamCompo from "@/components/TeamCompo";
import TeamStructure from "@/components/TeamStructure";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Users, GitBranch } from "lucide-react";
import React, { useState } from "react";
const TABS = [
  { tab: "Teams", icon: <Users />, element: <TeamCompo /> },
  { tab: "Team Structure", icon: <GitBranch />, element: <TeamStructure /> },
];
function Teams() {
  const [currentTab, setCurrentTab] = useState("Teams");
  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 mx-auto container main">
      <div className="head">
        <h1 className="text-2xl font-gilBold">Team Management</h1>
        <p className="font-gilMedium text-gray-700">
          Manage teams, assign roles, and organize your workforce
        </p>
      </div>

      <Tabs defaultValue="Teams" className="mt-5">
        <TabsList className="flex gap-5">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.tab}
              value={tab.tab}
              onClick={() => setCurrentTab(tab.tab)}
              className={`${
                currentTab !== tab.tab && "text-gray-500"
              } font-gilBold`}
            >
              {tab.icon} {tab.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent className="font-gilMedium" key={tab.tab} value={tab.tab}>
            {tab.element}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export default Teams;
