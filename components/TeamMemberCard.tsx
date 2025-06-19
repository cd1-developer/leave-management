import { OrgMember } from "@/utils/DataSlice";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import formatDate from "@/Helper/formatDate";
import firstLetter from "@/Helper/FirstLetter";
import React from "react";
import formatString from "@/Helper/formatString";
interface TeamMemberCardProps {
  member: OrgMember;
}
function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
      <div className="flex items-center mb-2">
        <Avatar className="h-8 w-8 mr-3">
          <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
            {firstLetter(member.user.username)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-slate-800 text-sm">
            {formatString(member.user.username)}
          </p>
          <p className="text-xs text-slate-600">{member.user.email}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge
          variant={member.user.role === "ADMIN" ? "default" : "outline"}
          className={`text-xs ${
            member.user.role === "ADMIN" ? "bg-blue-600" : ""
          }`}
        >
          {member.user.role}
        </Badge>

        <span className="text-xs text-slate-500">
          Joined: {formatDate(member.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default TeamMemberCard;
