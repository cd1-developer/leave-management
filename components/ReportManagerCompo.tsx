import React, { useMemo, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DialogCompo from "./DialogCompo";
import firstLetter from "@/Helper/FirstLetter";
import { Users, UserPlus, UserRoundMinus } from "lucide-react";

import { RootState } from "@/utils/Store";
import { useSelector, useDispatch } from "react-redux";
import {
  OrgMember,
  ReportManager,
  setIsFetch,
  setOrgMembers,
  setReportManagers,
} from "@/utils/DataSlice";
import axios from "axios";
import { toast } from "sonner";

const OPTIONS = ["All Structure", "Manager (No Team)", "With Members"];

function ReportManagerCompo() {
  const dispatch = useDispatch();
  const [isOpenAssignMemeberDialog, setIsOpenAssignMemberDialog] =
    useState(false);
  const [input, setInput] = useState("");
  const [searchTeamMember, setSearchTeamMember] = useState<string>("");
  const [selectAssignMember, setSelectAssignMember] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [selectedReportManager, setSelectedReportManager] = useState<
    ReportManager | {}
  >({});
  const [selectedValue, setSelectedValue] = useState<String>(OPTIONS[0]);

  const orgMembers = useSelector(
    (state: RootState) => state.dataSlice.orgMembers
  ).filter((member) => member.user.role !== "ADMIN");

  const reportManager = useSelector(
    (state: RootState) => state.dataSlice.reportManagers
  );

  /**
   * Filters the organization members based on a search input,
   * excluding:
   * - The report manager (e.g., Rohit)
   * - Any members who are already part of the report manager's team
   *
   * If the input is blank, it returns an empty list.
   */
  const searchedMembers = useMemo(() => {
    // Early exit conditions:
    // 1. No report manager is selected
    // 2. Search term is empty or just whitespace
    if (!selectedReportManager || searchTeamMember.trim() === "") return [];

    /**
     * Find the supervisor (higher-level manager) of the currently selected report manager
     * by matching the selected manager's email in the orgMembers list
     * and returning their supervisor's email if exists
     */
    const supervisorEmail = orgMembers?.find(
      (member: OrgMember) =>
        member.user.email ===
        (selectedReportManager as ReportManager).user.email
    )?.reportManager?.user.email;

    // Get all team member emails under the current report manager
    // Handle case where manager has no team members (empty array)
    const teamMemberEmails =
      (selectedReportManager as ReportManager).members.length === 0
        ? []
        : (selectedReportManager as ReportManager).members.map(
            (teamMember: OrgMember) => teamMember.user.email
          );

    // Combine all emails that should be excluded from search results:
    // 1. The report manager's own email
    // 2. All existing team member emails
    // 3. The supervisor's email (if exists, otherwise empty string)
    let excludedTeamEmails = [
      (selectedReportManager as ReportManager).user.email,
      ...teamMemberEmails,
      supervisorEmail ? supervisorEmail : "",
    ];

    // Filter orgMembers through two consecutive filters:
    // 1. First filter removes all excluded emails (manager, team, supervisor)
    // 2. Second filter matches search term against username or email (case-insensitive)
    const findedMembers = orgMembers
      .filter(
        (member: OrgMember) => !excludedTeamEmails.includes(member.user.email)
      )
      .filter(
        (member: OrgMember) =>
          member.user.username
            .toLowerCase()
            .includes(searchTeamMember.toLowerCase()) ||
          member.user.email
            .toLowerCase()
            .includes(searchTeamMember.toLowerCase())
      );

    return findedMembers;
  }, [selectedReportManager, searchTeamMember, orgMembers]);

  function toggleMembers(memberId: any) {
    if (selectAssignMember.includes(memberId)) {
      setSelectAssignMember(selectAssignMember.filter((id) => id !== memberId));
    } else {
      setSelectAssignMember([...selectAssignMember, memberId]);
    }
  }

  function handleAssignMembers() {
    try {
      const memberToAssign = orgMembers.filter((mem: OrgMember) => {
        return selectAssignMember.includes(mem.id);
      });

      const updateReportManager = reportManager.map(
        (manager: ReportManager) => {
          if (manager.id === (selectedReportManager as ReportManager).id) {
            return {
              ...manager,
              members: [...manager.members, ...memberToAssign], // Spread 'memberToAssign' instead of nesting
            };
          }
          return manager;
        }
      ) as ReportManager[];
      const updatedOrgMembers = orgMembers.map((member: OrgMember) => {
        if (selectAssignMember.includes(member.id)) {
          return {
            ...member,
            reportManager: selectedReportManager as ReportManager,
            reportManagerId: (selectedReportManager as ReportManager).id,
          };
        } else {
          return member;
        }
      }) as OrgMember[];

      startTransition(async () => {
        try {
          const responses = await Promise.all(
            memberToAssign.map((member: OrgMember) =>
              axios.post("/api/add-team-member", {
                orgMemberId: member.id,
                reportManagerId: (selectedReportManager as ReportManager).id,
              })
            )
          );

          let hasError = false;

          responses.forEach((res) => {
            const { success, message } = res.data;
            if (!success) {
              hasError = true;
              toast.error(message || "Failed to assign member", {
                position: "bottom-right",
                duration: 3000,
                className: "bg-red-700 text-white border border-red-600",
              });
            }
          });

          if (!hasError) {
            // First Updating Store and then making API call to store it in database
            dispatch(setReportManagers(updateReportManager));
            dispatch(setOrgMembers(updatedOrgMembers));
            setIsOpenAssignMemberDialog(false);
            dispatch(setIsFetch());
            setSelectAssignMember([]);
          }
        } catch (error) {
          console.error("Error during member assignment API calls:", error);
          toast.error("An unexpected error occurred while assigning members.", {
            position: "bottom-right",
            duration: 3000,
            className: "bg-red-700 text-white border border-red-600",
          });
        }
      });
    } catch (error) {
      console.error("Error in handleAssignMembers:", error);
      toast.error("Something went wrong while processing the assignment.", {
        position: "bottom-right",
        duration: 3000,
        className: "bg-red-700 text-white border border-red-600",
      });
    }
  }

  function handleDropdown(value: String) {
    setSelectedValue(value);
  }

  const filterReportMangers = useMemo(() => {
    let searchedReportManager = [] as ReportManager[];
    if (selectedValue === "All Structure") {
      searchedReportManager = reportManager;
    } else if (selectedValue === "Manager (No Team)") {
      searchedReportManager = reportManager.filter(
        (manager) => manager.members.length === 0
      );
    } else if (selectedValue === "With Members") {
      searchedReportManager = reportManager.filter(
        (manager) => manager.members.length > 0
      );
    }

    // know filtering report manager based on Input Search

    searchedReportManager =
      input === ""
        ? searchedReportManager
        : searchedReportManager.filter((manager: ReportManager) =>
            manager.user.username.toLowerCase().includes(input.toLowerCase())
          ) ||
          searchedReportManager.filter((manager: ReportManager) =>
            manager.user.email.toLowerCase().includes(input.toLowerCase())
          );

    return searchedReportManager;
  }, [selectedValue, input]);

  // function replaceUnderScore(role: String) {
  //   return role.replace(/_/g, " ");
  // }

  function replaceUnderScore(str: any) {
    const trimString = str.trim();
    const splitString = trimString
      .split("_")
      .map((string: String) => {
        return string;
      })
      .join(" ");
    return splitString;
  }

  return (
    <div className="w-full sm:w-[30rem] md:w-full">
      <div className="mt-10 flex items-center flex-wrap gap-4 search-field">
        <div className="flex-1 input-field">
          <Input
            className="placeholder:tracking-wider placeholder:font-gilRegular placeholder:text-[0.75rem]"
            placeholder="Search Report Manager..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="dropdown">
          <Select
            defaultValue={OPTIONS[0]}
            onValueChange={(value) => handleDropdown(value)}
          >
            <SelectTrigger
              size="default"
              className="font-gilMedium py-5 border-[1px] border-[rgba(0,0,0,0.4)]"
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="font-gilMedium">
                {OPTIONS.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>

              <SelectSeparator />
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-8 adding-member">
        <div className="flex items-center gap-3 head">
          <i>
            <Users size={22} />
          </i>
          <span className="font-gilSemiBold text-xl mt-0.5">
            Reporting Hierarchy
          </span>
        </div>

        <div className="members">
          <ul className="">
            {filterReportMangers.length === 0 ? (
              <div className="flex flex-col items-center opacity-50">
                <span>
                  <UserPlus size={32} strokeWidth={1.5} />
                </span>
                <span className="font-gilMedium text-lg">
                  No Report Manager Found
                </span>
              </div>
            ) : (
              filterReportMangers?.map((member: ReportManager) => (
                <li
                  className=" bg-zinc-100 mt-7 px-1 sm:px-3 py-8 rounded-md shadow-md"
                  key={member.id}
                >
                  <Accordion type="single" collapsible className="">
                    <AccordionItem
                      value={member.id}
                      className="border-none w-full"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <AccordionTrigger className="cursor-pointer">
                          <div className="bg-blue-200  text-blue-900 w-10 h-10 flex items-center justify-center rounded-[50%] font-gilMedium sm:font-gilSemiBold text-sm sm:text-[1rem]">
                            {firstLetter(member.user.username)}
                          </div>

                          <div className="">
                            <div className="flex flex-col items-start sm:flex-row sm:items-center gap-0 sm:gap-2 member">
                              <h2 className="font-gilSemiBold text-[1rem] sm:text-[1.2rem]">
                                {member.user.username}
                              </h2>
                              <p className="text-[0.55rem] sm:text-[0.8rem] text-white font-gilSemiBold sm:font-gilMedium tracking-sm bg-blue-600 px-3 py-1 sm:py-0.5 rounded-4xl">
                                {/* {member.user.role} */}
                                {replaceUnderScore(member.user.role)}
                              </p>
                            </div>
                            <div className="text-[0.8rem] sm:text-[0.9rem] mt-1.5 sm:mt-0 font-gilMedium text-gray-600">
                              {member.user.email}
                            </div>
                          </div>
                        </AccordionTrigger>
                      </div>

                      <AccordionContent className="pl-0 sm:pl-16">
                        <div className="bg-white p-6 rounded-md shadow-sm">
                          <DialogCompo
                            isOpen={isOpenAssignMemeberDialog}
                            onOpenChange={() =>
                              setIsOpenAssignMemberDialog(false)
                            }
                            title="Add Members to Manager"
                            icon={<UserPlus size={18} strokeWidth={2.35} />}
                          >
                            <div className="my-5 input">
                              <Input
                                placeholder="Search Users..."
                                onChange={(e) =>
                                  setSearchTeamMember(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              {searchedMembers?.length === 0 ? (
                                <div className="flex flex-col items-center opacity-50">
                                  <span>
                                    <UserPlus size={25} strokeWidth={1.5} />
                                  </span>
                                  <span className="font-gilMedium text-sm">
                                    No unassigned members available
                                  </span>
                                </div>
                              ) : (
                                <ScrollArea className="h-[20rem]">
                                  <div className="grid space-y-2">
                                    {searchedMembers?.map((mem: OrgMember) => (
                                      <div
                                        key={mem.id}
                                        className={`relative cursor-pointer border rounded-md p-2 flex items-center gap-4 ${
                                          selectAssignMember.includes(mem.id)
                                            ? "bg-sky-100"
                                            : ""
                                        }`}
                                        onClick={() => toggleMembers(mem.id)}
                                      >
                                        <div
                                          id="profile"
                                          className={`bg-zinc-200 p-5 w-[2rem] h-[2rem] flex items-center justify-center rounded-[50%] font-gilSemiBold text-[1rem]`}
                                        >
                                          {firstLetter(mem.user.username)}
                                        </div>
                                        <div className="info">
                                          <h2 className="font-gilMedium text-md text-gray-800">
                                            {mem.user.username}
                                          </h2>
                                          <p className="font-gilMedium text-zinc-500 text-[0.8rem]">
                                            {mem.user.email}
                                          </p>
                                        </div>
                                        <div className="absolute right-6 text-xl">
                                          {selectAssignMember.includes(
                                            mem.id
                                          ) && (
                                            <svg
                                              className="w-5 h-5 text-black"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              )}
                            </div>

                            <div className="flex gap-4 justify-end">
                              <Button
                                variant="outline"
                                className="cursor-pointer border px-3 py-1.5 rounded-sm font-gilMedium"
                                onClick={() =>
                                  setIsOpenAssignMemberDialog(false)
                                }
                              >
                                Cancel
                              </Button>
                              <Button
                                disabled={selectAssignMember.length === 0}
                                // onClick={() =>
                                //   handleAssignManager(selectedMembers)
                                // }
                                className="cursor-pointer border bg-blue-700 text-white px-3 py-1.5 rounded-sm font-gilMedium"
                                onClick={handleAssignMembers}
                              >
                                {isPending ? (
                                  <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Assing Members...
                                  </div>
                                ) : (
                                  <p>
                                    Assign {selectAssignMember.length} Members
                                  </p>
                                )}
                              </Button>
                            </div>
                          </DialogCompo>
                          {/* Your content here */}
                          {member.members.length === 0 ? (
                            <div className="flex flex-col gap-3 items-center justify-center">
                              <h2 className="text-zinc-400">
                                {" "}
                                <Users size={30} />
                              </h2>

                              <h2 className="text-md text-zinc-500">
                                No members assigned yet
                              </h2>

                              <Button
                                className="font-gilRegular bg-white text-black hover:bg-slate-200 cursor-pointer"
                                onClick={() => {
                                  setSelectedReportManager(member);
                                  setIsOpenAssignMemberDialog(true);
                                }}
                              >
                                <div className=" flex items-center gap-3 cursor-pointer px-4 py-2 rounded-sm">
                                  <UserPlus size={14} />
                                  <h2 className="font-gilSemiBold text-sm">
                                    Add Members
                                  </h2>
                                </div>
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {member.members.map((teamMember: OrgMember) => (
                                <div
                                  key={teamMember.id}
                                  className="flex gap-2 items-center relative"
                                >
                                  <h2 className="text-md h-8 w-8 flex items-center justify-center text-white font-gilMedium tracking-sm bg-zinc-400 px-3 py-0.5 rounded-4xl">
                                    {firstLetter(teamMember.user.username)}
                                  </h2>
                                  <div className="flex flex-col ">
                                    <h2 className="text-md font-gilSemiBold text-zinc-600">
                                      {teamMember.user.username}
                                    </h2>
                                    <h2 className="text-zinc-500 text-[0.8rem]">
                                      {teamMember.user.email}
                                    </h2>
                                  </div>

                                  <div className="absolute right-2 right-sec">
                                    <div className="member">
                                      {teamMember.user.role}
                                    </div>
                                    <div
                                      className="cursor-pointer dlt-member"
                                      // onClick={() =>
                                      //   handleDeleteMember(teamMember.id)
                                      // }
                                    >
                                      <UserRoundMinus
                                        size={16}
                                        className="text-red-600"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <Button
                                className="font-gilRegular bg-white text-black hover:bg-slate-200 cursor-pointer"
                                onClick={() => {
                                  setSelectedReportManager(member);
                                  setIsOpenAssignMemberDialog(true);
                                }}
                              >
                                <div className=" flex items-center gap-3 cursor-pointer px-4 py-2 rounded-sm">
                                  <UserPlus size={14} />
                                  <h2 className="font-gilSemiBold text-sm">
                                    Add Members
                                  </h2>
                                </div>
                              </Button>
                            </div>
                          )}
                          {/* You can add more content or components here */}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ReportManagerCompo;
