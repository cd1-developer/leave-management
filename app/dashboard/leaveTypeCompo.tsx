import React, { useEffect, useState, useTransition } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/Store";
import axios from "axios";
import { leaveTypes, setLeaveTypes } from "@/utils/DataSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LeaveTypeDialog from "@/components/LeaveTypeDialog";
import { Calendar } from "lucide-react";

import LeaveTypeCard from "@/components/leaveTypeCard";
import { toast } from "sonner";
function LeaveTypeCompo() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const organizationLeaveTypes = useSelector(
    (state: RootState) => state.dataSlice.leaveTypes
  );

  const organizationId = useSelector(
    (state: RootState) => state.dataSlice.userInfo
  ).organizations[0].id;

  const isFetch = useSelector((state: RootState) => state.dataSlice.isFetch);

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

  function handleDeleteLeaveType(id: string) {
    startTransition(async () => {
      const res = await axios.delete(`/api/deleteLeave?id=${id}`);
      const { success, message } = res.data;
      if (!success) {
        toast.error(message);
      }
      const newLeaveTypes = organizationLeaveTypes.filter(
        (leave: leaveTypes) => leave.id !== id
      );
      dispatch(setLeaveTypes(newLeaveTypes));
      toast.success(message);
    });
  }

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
          <div className="text-center py-6 sm:py-8">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-slate-600">No leave types configured yet</p>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Click the "Add Leave Type" button to create your first leave type
            </p>
          </div>
        ) : (
          <div>
            {" "}
            {/* Leave Types List */}
            <div className="space-y-3 sm:space-y-4">
              {organizationLeaveTypes.map((leaveType) => (
                <LeaveTypeCard
                  key={leaveType.id}
                  leaveType={leaveType}
                  onDelete={handleDeleteLeaveType}
                  isPending={isPending}
                />
              ))}
            </div>
          </div>
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
