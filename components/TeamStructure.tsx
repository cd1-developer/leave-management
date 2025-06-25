import React, { useMemo, useEffect, useState } from "react";
import { UserPlus, Users, Users2 } from "lucide-react";
import firstLetter from "@/Helper/FirstLetter";
import { ScrollArea } from "@/components/ui/scroll-area";

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

import { Input } from "../components/ui/input";
import { Button } from "./ui/button";

import DialogCompo from "./DialogCompo";

// TASk

// assign some members to REPORT_MANAGER and add Other member's to be Under REPORT_MANAGER
const ORG_MEMBERS = [
  {
    id: "om_001",
    organizationId: "org_001",
    userId: "user_001",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_001",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-01-15T10:30:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_002",
    organizationId: "org_001",
    userId: "user_002",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_002",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-02-01T09:00:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_003",
    organizationId: "org_001",
    userId: "user_003",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_003",
      name: "Charlie Davis",
      email: "charlie@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-02-10T14:45:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_004",
    organizationId: "org_001",
    userId: "user_004",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_004",
      name: "Dana Lee",
      email: "dana@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-03-05T11:15:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_005",
    organizationId: "org_001",
    userId: "user_005",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_005",
      name: "Evan Gray",
      email: "evan@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-03-18T13:25:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_006",
    organizationId: "org_001",
    userId: "user_006",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_006",
      name: "Fiona Clark",
      email: "fiona@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-04-01T08:40:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_007",
    organizationId: "org_001",
    userId: "user_007",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_007",
      name: "George Hall",
      email: "george@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-04-15T17:10:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_008",
    organizationId: "org_001",
    userId: "user_008",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_008",
      name: "Hannah Wright",
      email: "hannah@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-05-03T12:50:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_009",
    organizationId: "org_001",
    userId: "user_009",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_009",
      name: "Isaac King",
      email: "isaac@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-05-22T10:05:00Z",
    reportManager: {},
    members: [],
  },
  {
    id: "om_010",
    organizationId: "org_001",
    userId: "user_010",
    organization: { id: "org_001", name: "Acme Corp" },
    user: {
      id: "user_010",
      name: "Jenna Morris",
      email: "jenna@example.com",
      role: "MEMBER",
    },
    createdAt: "2023-06-01T16:20:00Z",
    reportManager: {},
    members: [],
  },
];

function TeamStructure() {
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchTeamMember, setSearchTeamMember] = useState<string>("");
  const [orgMembers, setOrgMembers] = useState(ORG_MEMBERS);
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenAssignMemeberDialog, setIsOpenAssignMemberDialog] =
    useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAssignMember, setSelectAssignMember] = useState<string[]>([]);
  const [selectedReportManager, setSelectedReportManager] = useState({});

  // <----------- Members Checked Functionality ---------->
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const filteredMembers = useMemo(() => {
    return Array.isArray(orgMembers)
      ? orgMembers.filter((member: any) => {
          const match =
            member.user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
            member.user.email.toLowerCase().includes(searchUser.toLowerCase());

          const isVisible = member.user.role !== "Report Manager" && match;

          return isVisible;
        })
      : [];
  }, [searchUser]);

  function handleAssignManager(selectedMembers: string[]) {
    const updatedMembers = orgMembers.map((member) => {
      if (selectedMembers.includes(member.id)) {
        return {
          ...member,
          user: {
            ...member.user,
            role: "Report Manager",
          },
        };
      }
      return member;
    });

    setOrgMembers(updatedMembers);
    setIsOpen(false);
    setSelectedMembers([]);
  }

  const reportManager = Array.isArray(orgMembers)
    ? orgMembers.filter((member) => member.user.role === "Report Manager")
    : [];

  /**
   * Filters the organization members based on a search input, excluding:
   * - The report manager (e.g., Rohit)
   * - Any members who are already part of the report manager's team
   *
   * If the input is blank, it returns an empty list.
   */
  const searchedMembers = useMemo(() => {
    // Collect the member IDs to exclude from search results:
    // - The current report manager (member.id)
    // - All members already reporting to this manager (member.members[].id);
    if (!selectedReportManager || searchTeamMember.trim() === "") return [];
    const teamMemberIds =
      selectedReportManager?.members?.length === 0
        ? []
        : selectedReportManager?.members?.map((mem: any) => mem.id);
    const excludedMemberIds = [selectedReportManager?.id, ...teamMemberIds];
    // If the search term is not empty, filter the org members
    const findMembers =
      searchTeamMember !== ""
        ? orgMembers
            // Exclude the report manager and their team members
            .filter((mem) => !excludedMemberIds.includes(mem.id))
            // Filter by name or email that includes the search term
            .filter(
              (mem) =>
                mem.user.name
                  .toLowerCase()
                  .includes(searchTeamMember.toLowerCase()) ||
                mem.user.email
                  .toLowerCase()
                  .includes(searchTeamMember.toLowerCase())
            )
        : []; // If input is empty, return an empty array
    return findMembers;
  }, [selectedReportManager, searchTeamMember, orgMembers]);

  function toggleMembers(memberId: any) {
    if (selectAssignMember.includes(memberId)) {
      setSelectAssignMember(selectAssignMember.filter((id) => id !== memberId));
    } else {
      setSelectAssignMember([...selectAssignMember, memberId]);
    }
  }

  // Adding Member in Report Manager
  function handleAssignMembers(reportManagerMemberId: string) {
    const selectedMembers = Array.isArray(orgMembers)
      ? orgMembers.filter((member) => selectAssignMember.includes(member.id))
      : [];
    let newOrganizationMembers = Array.isArray(orgMembers)
      ? orgMembers.map((mem: any) => {
          if (mem.id === reportManagerMemberId) {
            return {
              ...mem,
              members: [...mem.members, ...selectedMembers],
            };
          } else return mem;
        })
      : [];
    setOrgMembers(newOrganizationMembers);
    setIsOpenAssignMemberDialog(false);
    setSelectAssignMember([]);
  }

  return (
    <section className="mt-5 container">
      <div className="top-sec flex justify-between">
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
            <div className="manage">
              <div className="flex gap-1 items-center">
                <span>{reportManager.length}</span>
                <span>Managed Members</span>
              </div>
            </div>
            <div className="unassign">
              <div>1 Unassigned Members</div>
            </div>
          </div>
        </div>
        <Button
          className="bg-blue-700 font-gilRegular cursor-pointer hover:bg-blue-800"
          onClick={() => setIsOpen(true)}
        >
          <UserPlus />
          <span>Assign Manager</span>
        </Button>
        <div className="right-sec">
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
            <ScrollArea className="h-[20rem]">
              <div className="grid space-y-2">
                {filteredMembers?.map((member: any) => (
                  <ul key={member.id}>
                    <li
                      className={`relative cursor-pointer border rounded-md p-2 flex items-center gap-4 ${
                        selectedMembers.includes(member.id) && "bg-sky-100"
                      }`}
                      onClick={() => toggleMemberSelection(member.id)}
                    >
                      <div className="bg-zinc-200 p-5 w-[2rem] h-[2rem] flex items-center justify-center rounded-[50%] font-gilMedium text-[1.05rem]">
                        {firstLetter(member.user.name)}
                      </div>

                      <div>
                        <h2 className="font-gilSemiBold">{member.user.name}</h2>
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
                onClick={() => handleAssignManager(selectedMembers)}
                className="cursor-pointer border bg-blue-700 text-white px-3 py-1.5 rounded-sm font-gilMedium "
              >
                Assign as Manager
              </Button>
            </div>
          </DialogCompo>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4 search-field">
        <div className="flex-1 input-field">
          <Input
            className="placeholder:tracking-wider placeholder:font-gilRegular placeholder:text-[0.75rem]"
            placeholder="Search managers and members..."
          />
        </div>
        <div className="dropdown">
          <Select>
            <SelectTrigger
              size="default"
              className="w-[180px] font-gilMedium py-5 border-[1px] border-[rgba(0,0,0,0.4)]"
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="font-gilMedium">
                {/* <SelectLabel>Fruits</SelectLabel> */}
                <SelectItem value="All Structure">All Structure</SelectItem>
                <SelectItem value="Managers Only">Managers Only</SelectItem>
                <SelectItem value="With Members">With Members</SelectItem>
                <SelectItem value="Unassignes Only">Unassigned Only</SelectItem>
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
          <ul>
            {reportManager.map((member) => (
              <li
                className=" bg-zinc-100 mt-7 p-6 py-8 rounded-md shadow-md"
                key={member.id}
              >
                <Accordion type="single" collapsible className="">
                  <AccordionItem
                    value={member.id}
                    className="border-none w-full"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <AccordionTrigger className="w-[50rem] cursor-pointer">
                        <div className="bg-blue-200  text-blue-900 w-10 h-10 flex items-center justify-center rounded-[50%] font-gilSemiBold">
                          {firstLetter(member.user.name)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 member">
                            <h2 className="font-gilSemiBold text-[1.2rem]">
                              {member.user.name}
                            </h2>
                            <p className="text-[0.8rem] text-white font-gilSemiBold tracking-sm bg-blue-600 px-3 py-0.5 rounded-4xl">
                              {member.user.role}
                            </p>
                          </div>
                          <div className="text-[0.9rem] font-gilMedium text-gray-600">
                            {member.user.email}
                          </div>
                        </div>
                      </AccordionTrigger>
                    </div>

                    <AccordionContent className="pl-16">
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
                            {searchedMembers.length === 0 ? (
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
                                  {searchedMembers.map((mem: any) => (
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
                                        {firstLetter(mem.user.name)}
                                      </div>
                                      <div className="info">
                                        <h2 className="font-gilMedium text-md text-gray-800">
                                          {mem.user.name}
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
                              onClick={() => setIsOpenAssignMemberDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              disabled={selectAssignMember.length === 0}
                              // onClick={() =>
                              //   handleAssignManager(selectedMembers)
                              // }
                              className="cursor-pointer border bg-blue-700 text-white px-3 py-1.5 rounded-sm font-gilMedium "
                              onClick={() => handleAssignMembers(member.id)}
                            >
                              Assign {selectAssignMember.length} Members
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
                            {member.members.map((teamMember: any) => (
                              <div
                                key={teamMember.id}
                                className="flex gap-2 items-center"
                              >
                                <h2 className="text-md h-8 w-8 flex items-center justify-center text-white font-gilMedium tracking-sm bg-zinc-400 px-3 py-0.5 rounded-4xl">
                                  {firstLetter(teamMember.user.name)}
                                </h2>
                                <div className="flex flex-col ">
                                  <h2 className="text-md font-gilSemiBold text-zinc-600">
                                    {teamMember.user.name}
                                  </h2>
                                  <h2 className="text-zinc-500 text-[0.8rem]">
                                    {teamMember.user.email}
                                  </h2>
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
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
export default TeamStructure;
