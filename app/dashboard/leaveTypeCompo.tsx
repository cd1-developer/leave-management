import React, { useEffect, useMemo, useState, useTransition } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/Store";
import axios from "axios";
import { setLeaveTypes } from "@/utils/DataSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LeaveTypeDialog from "@/components/LeaveTypeDialog";
function LeaveTypeCompo() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const organizationLeaveTypes = useSelector(
    (state: RootState) => state.dataSlice.leaveTypes
  );

  const organizationId = useSelector(
    (state: RootState) => state.dataSlice.userInfo
  ).organizations[0].id;

  const isFetch = useSelector((state: RootState) => state.dataSlice.isFetch);

  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await axios.get(
          `/api/getOrgLeaveTypes?organizationId=${organizationId}`
        );

        const { leaveTypes } = res.data;

        dispatch(setLeaveTypes(leaveTypes));
      } catch (error) {
        console.error("Failed to fetch leave types:", error);
      }
    };

    fetchLeaveTypes();
  }, [isFetch]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
          Leave Types Configuration
        </h2>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Leave Type
        </Button>
      </div>

      <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 ">
        Configure different types of leaves and their allocations for your
        organization.
      </p>

      {/* Leave Types List */}
      <div className="space-y-3 sm:space-y-4">
        {organizationLeaveTypes.length === 0 ? (
          <div className="p-3 text-sm text-center font-semibold text-gray-500 md:text-md">
            "No leave types have been configured for this organization yet.
            Please add leave types to manage leave policies effectively."
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <LeaveTypeDialog
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title="Add Leave Type"
        discription="Configure a new leave type for your organization."
        organizationId={organizationId}
        organizationLeaveTypes={organizationLeaveTypes}
      />
    </div>
  );
}

export default LeaveTypeCompo;
