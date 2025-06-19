import { OrgMember } from "@/utils/DataSlice";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import formatDate from "@/Helper/formatDate";
import firstLetter from "@/Helper/FirstLetter";
import formatString from "@/Helper/formatString";
interface TeamMemberTabelProps {
  organizationMembers: OrgMember[];
}

function TeamMemberTabel({ organizationMembers }: TeamMemberTabelProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Role
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Joined
            </th>
          </tr>
        </thead>
        <tbody>
          {organizationMembers.map((member: OrgMember) => (
            <tr
              key={member.id}
              className="border-b border-slate-100 hover:bg-slate-50/50"
            >
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 ">
                    <AvatarFallback className="bg-blue-100 text-blue-800 w-full flex items-center justify-center">
                      {firstLetter(member.user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-slate-800">
                    {formatString(member.user.username)}
                  </span>
                </div>
              </td>

              <td className="py-3 px-4 text-slate-600">{member.user.email}</td>
              <td className="py-3 px-4">
                <Badge
                  variant={member.user.role === "ADMIN" ? "default" : "outline"}
                  className={member.user.role === "ADMIN" ? "bg-blue-600" : ""}
                >
                  {member.user.role}
                </Badge>
              </td>
              <td className="py-3 px-4 text-slate-600">
                {formatDate(member.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeamMemberTabel;
