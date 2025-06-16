import { leaveTypes } from "@/utils/DataSlice";
import React from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
interface LeaveTypeCardType {
  leaveType: leaveTypes;
  onDelete: (id: string) => void;
}
function LeaveTypeCard({ leaveType, onDelete }: LeaveTypeCardType) {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3"
            style={{ backgroundColor: leaveType.colorCode }}
          ></div>
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
            {leaveType.type}
          </h3>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(leaveType.id)}
            className="text-red-600 hover:text-red-800 h-8 w-8 p-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
        <div>
          <p className="text-slate-500">Leaves In Year</p>
          <p className="text-slate-700">
            <span className="font-medium">{leaveType.leaveInYear} days</span>{" "}
            per year
          </p>
        </div>

        <div>
          <p className="text-slate-500">Leaves In Month</p>
          <p className="text-slate-700">{leaveType.leaveInMonth}</p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-slate-500">Description</p>
          <p className="text-slate-700">{leaveType.leaveDiscription}</p>
        </div>
      </div>
    </div>
  );
}

export default LeaveTypeCard;
