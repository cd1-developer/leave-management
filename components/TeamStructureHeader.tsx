import React, { useState, useMemo, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { UserPlus, Users2, Users } from "lucide-react";
import DialogCompo from "./DialogCompo";
import firstLetter from "@/Helper/FirstLetter";
import { RootState } from "@/utils/Store";
import { useSelector, useDispatch } from "react-redux";
import { OrgMember, ReportManager, setReportManagers } from "@/utils/DataSlice";
import axios from "axios";
import { toast } from "sonner";
import { setIsFetch, removeReportManager } from "@/utils/DataSlice";

function TeamStructureHeader() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [searchUser, setSearchUser] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();
  const orgMembers = useSelector(
    (state: RootState) => state.dataSlice.orgMembers
  );
  const organization = useSelector(
    (state: RootState) => state.dataSlice.organization
  );
  const organizationId = organization.id;
  const reportManager = useSelector(
    (state: RootState) => state.dataSlice.reportManagers
  );

  const filteredMembers = useMemo(() => {
    return Array.isArray(orgMembers)
      ? orgMembers.filter((member: OrgMember) => {
          const match =
            member.user.username
              .toLowerCase()
              .includes(searchUser.toLowerCase()) ||
            member.user.email.toLowerCase().includes(searchUser.toLowerCase());

          const isVisible =
            member.user.role !== "REPORTED_MANAGER" &&
            member.user.role !== "ADMIN" &&
            match;

          return isVisible;
        })
      : [];
  }, [searchUser]);

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  function handleAssignManager() {
    startTransition(async () => {
      const selectedReportManager = Array.isArray(orgMembers)
        ? orgMembers
            .filter((member) => selectedMembers.includes(member.id))
            .map((member: OrgMember) => ({
              id: crypto.randomUUID(),
              organizationId,
              orgMemberId: member.id,
              userId: member.user.id,
              user: member.user,
              members: [],
            }))
        : [];

      dispatch(setReportManagers([...reportManager, ...selectedReportManager]));
      setIsOpen(false);

      try {
        const response = await Promise.all(
          selectedReportManager.map((member: ReportManager) =>
            axios
              .post("/api/report-manager/assign-report-manager", {
                userId: member.userId,
                orgMemberId: member.id,
                organizationId,
              })
              .then((res) => ({ success: true, member, res }))
              .catch((err: any) => ({ success: false, member, err }))
          )
        );
        const failedMembers = response
          .filter((r) => !r.success)
          .map((r) => r.member);

        const successReponse = response.filter((r) => r.success);

        failedMembers.forEach((member: ReportManager) => {
          toast.error(`Failed to assign ${member.user.username}`, {
            position: "bottom-right",
            duration: 3000,
            className: "bg-red-700 text-white border border-red-600",
          });
          dispatch(removeReportManager(member.id));
        });

        if (successReponse.length > 0) {
          toast.success("All members added successfully", {
            position: "bottom-right",
            duration: 3000,
            className: "bg-green-700 text-white border border-green-600",
          });
          dispatch(setIsFetch());
        }
      } catch (error: any) {
        console.log(`Error Occur while assinging manager ${error}`);
        toast.error("Error Occur while assinging manager", {
          position: "bottom-right",
          duration: 3000,
          className: "bg-red-700 text-white border border-red-600",
        });
      }
    });
  }

  return (
    <div className="w-full sm:w-[30rem] md:w-full flex flex-wrap items-center gap-2 justify-between">
      <div className="left">
        <div className="head">
          <h1 className="text-[1.45rem] font-gilBold">Team Structure</h1>
          <p className="font-gilMedium text-gray-800 text-[0.9rem]">
            Manage reporting hierarchy and assign Report Managers
          </p>
        </div>
        <div className="mt-3 flex gap-5 font-gilMedium text-gray-600 text-[0.8rem] user-detail">
          <div className="report">
            <div className="flex gap-1 items-center">
              <span>{reportManager.length}</span>
              <span>Report Managers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="right-sec">
        <Button
          className="bg-blue-700 font-gilRegular cursor-pointer hover:bg-blue-800 "
          onClick={() => setIsOpen(true)}
        >
          <UserPlus />
          <span>Assign Manager</span>
        </Button>
        <DialogCompo
          isOpen={isOpen}
          onOpenChange={() => setIsOpen(false)}
          title="Assign Report Manager"
          icon={<Users2 />}
        >
          <div className="my-5 input">
            <Input
              value={searchUser}
              placeholder="Search Users..."
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-zinc-400">
                {" "}
                <Users size={30} />
              </h2>

              <h2 className="text-md text-zinc-500">No members is available</h2>
            </div>
          ) : (
            <ScrollArea className="h-[20rem]">
              <div className="grid space-y-2">
                {filteredMembers?.map((member: OrgMember) => (
                  <ul key={member.id}>
                    <li
                      className={`relative cursor-pointer border rounded-md p-2 flex items-center gap-4 ${
                        selectedMembers.includes(member.id) && "bg-sky-100"
                      }`}
                      onClick={() => toggleMemberSelection(member.id)}
                    >
                      <div className="bg-zinc-200 p-5 w-[2rem] h-[2rem] flex items-center justify-center rounded-[50%] font-gilMedium text-[1.05rem]">
                        {firstLetter(member.user.username)}
                      </div>

                      <div>
                        <h2 className="font-gilSemiBold">
                          {member.user.username}
                        </h2>
                        <h3 className="font-gilMedium text-gray-700 text-sm">
                          {member.user.email}
                        </h3>
                        <p className="font-gilRegular text-gray-600 text-[0.7rem]">
                          Role: {member.user.role}
                        </p>
                      </div>
                      {/* Checkbox */}
                      <div
                        className={`absolute right-5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedMembers.includes(member.id)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedMembers.includes(member.id) && (
                          <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </li>
                  </ul>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              className="cursor-pointer border px-3 py-1.5 rounded-sm font-gilMedium"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={selectedMembers.length === 0}
              onClick={() => handleAssignManager()}
              className="cursor-pointer border bg-blue-700 text-white px-3 py-1.5 rounded-sm font-gilMedium "
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Assing Manager...
                </div>
              ) : (
                <div className="flex gap-2 items-center">Assign Manager</div>
              )}
            </Button>
          </div>
        </DialogCompo>
      </div>
    </div>
  );
}

export default TeamStructureHeader;
