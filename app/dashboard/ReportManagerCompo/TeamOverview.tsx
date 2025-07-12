import React, { useEffect, useState } from "react";
import {
  CircleAlert,
  CircleCheckBig,
  CircleX,
  Divide,
  Search,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { OrgMember } from "@/utils/DataSlice";
import firstLetter from "@/Helper/FirstLetter";
import replaceUnderScore from "@/Helper/ReplaceUnderScore";
interface TeamOverviewPropType {
  members: OrgMember[];
}

const TeamOverview = ({ members }: TeamOverviewPropType) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchedMembers, setSearchedMembers] = useState<OrgMember[]>([]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }
  useEffect(() => {
    if (!Array.isArray(members)) return;

    const allMembers = members.filter(
      (member) =>
        member.user.username
          .trim()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        member.user.email
          .trim()
          .toLowerCase()
          .includes(searchInput.toLowerCase())
    );
    setSearchedMembers(allMembers);
  }, [searchInput]);

  console.log(searchedMembers);

  return (
    <div className="max-w-7xl mx-auto sm:px-0 lg:px-0 flex flex-col items-center">
      <div className="top w-full flex items-center justify-between flex-wrap mt-5">
        <div className="head">
          <h1 className="font-gilBold text-3xl text-gray-800">Team Overview</h1>
          <p className="font-gilMedium text-gray-600 text-sm sm:text-[1rem]">
            Manage your team members and their leave requests
          </p>
        </div>

        <div className="dropdown mt-4 sm:mt-0">
          <Select>
            <SelectTrigger
              //   size="default"
              className="font-gilMedium bg-white py-1 cursor-pointer border-1 border-[rgba(0,0,0,0.3)]"
            >
              <SelectValue placeholder="Select on view" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="font-gilMedium">
                  <SelectItem value="Members">Team Members</SelectItem>
                  <SelectItem value="Leaves">Leave Requests</SelectItem>
                </SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="res w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <div className="card bg-white px-5 py-4 flex items-center justify-between rounded-md">
          <div>
            <h2 className="font-gilMedium text-gray-600">Pending Requests</h2>
            <p className="font-gilBold text-orange-600 text-2xl">1</p>
          </div>
          <div className="icon">
            <i>
              <CircleAlert
                strokeWidth={2}
                size={32}
                className="text-orange-600"
              />
            </i>
          </div>
        </div>
        <div className="card bg-white px-5 py-4 flex items-center justify-between rounded-md">
          <div>
            <h2 className="font-gilMedium text-gray-600">Approved</h2>
            <p className="font-gilBold text-green-600 text-2xl">1</p>
          </div>
          <div className="icon">
            <i>
              <CircleCheckBig
                strokeWidth={2}
                size={32}
                className="text-green-600"
              />
            </i>
          </div>
        </div>
        <div className="card bg-white px-5 py-4 sm:col-span-2 md:col-span-1 flex items-center justify-between rounded-md">
          <div>
            <h2 className="font-gilMedium text-gray-600">Pending Requests</h2>
            <p className="font-gilBold text-red-600 text-2xl">1</p>
          </div>
          <div className="icon">
            <i>
              <CircleX strokeWidth={2} size={32} className="text-red-600" />
            </i>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 p-5 bg-white rounded-md search-bar">
        <input
          type="search"
          placeholder="Search team members..."
          className="w-full font-gilMedium outline-1 px-4 py-2.5 focus:shadow-md shadow-gray-600 rounded-md"
          onChange={handleSearch}
        />
      </div>

      <div className="members w-full mt-5">
        <div className="title">
          <h2 className="font-gilSemiBold text-xl text-gray-800 mb-4 mt-5">
            Total Members ({members.length})
          </h2>
        </div>

        {searchedMembers.length === 0 ? (
          <div className="w-full flex flex-col items-center">
            <i>
              <Users className="text-gray-500" size={20} />
            </i>
            <p className="font-gilRegular text-md text-gray-500">
              No team member found
            </p>
          </div>
        ) : (
          <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchedMembers.map((member) => (
              <li
                key={member.id}
                className="w-full bg-white rounded-md shadow-md"
              >
                <Accordion
                  type="single"
                  collapsible
                  className="w-full cursor-pointer"
                >
                  <AccordionItem value={member.id} className="border-none">
                    <AccordionTrigger className="flex-row-reverse justify-between px-4 py-3 w-full hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-4 w-full">
                        <div className="pf w-10 h-10 rounded-full bg-sky-200 text-sky-900 flex items-center justify-center font-gilMedium">
                          {firstLetter(member.user.username)}
                        </div>
                        <div className="user text-left flex-1 min-w-0">
                          <h3 className="font-gilSemiBold text-gray-800">
                            {member.user.username}
                          </h3>
                          <h4 className="text-sm mt-1 text-gray-600 font-gilMedium">
                            {replaceUnderScore(member.user.role)}
                          </h4>
                          <h5 className="text-sm text-gray-500 font-gilMedium">
                            {member.user.email}
                          </h5>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-3 pt-1 border-t border-gray-100">
                      <p className="text-gray-700">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Officia, illo.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamOverview;
