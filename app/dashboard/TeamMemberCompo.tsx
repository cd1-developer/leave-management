/*
===============================================
👨‍💻 TeamMemberCompo Task Instructions
===============================================

🎯 GOAL:
Build a React component (`TeamMemberCompo`) where:
1. Admin can see all members of the current organization.
2. Admin can add new users who are not already in any organization.

-----------------------------------------------
✅ 1. Display Current Organization Members
-----------------------------------------------
- Use the Redux store to get organization members:

  const organizationMembers = useSelector(
    (state: RootState) => state.dataSlice.orgMembers
  );

- Render these members in a list or table with:
  - username
  - email
  - role

-----------------------------------------------
✅ 2. Fetch Users Not in Any Organization
-----------------------------------------------
- Make a GET request to `/api/getUsers` to fetch users who are NOT part of any organization.

- Sample response:
  {
    "success": true,
    "allUsers": [
      {
        "id": "684c05efa4b2a272c6d23efa",
        "username": "Manish Arya",
        "email": "manish@gmail.com",
        "role": "USER"
      }
    ]
  }

- Store this array locally and show it as a dropdown or list to select a user for adding.

-----------------------------------------------
✅ 3. Add Selected User to the Organization
-----------------------------------------------

STEP 1: UPDATE REDUX STORE IMMEDIATELY (for better UX)
- Construct a dummy orgMember object:
  const newOrgMember = {
    id: Date.now().toString(),
    organizationId: organization.id,
    userId: user.id,
    organization: organization,
    user: user,
    managedBy: []
  };

- Dispatch to Redux:
  dispatch(setOrgMembers([...organizationMembers,newOrgMember]));

STEP 2: SEND TO BACKEND
- Make POST request to `/api/addOrgMember` with:
  {
    userId: user.id,
    organizationId: organization.id
  }

-----------------------------------------------
✅ 4. Refresh Members After Adding
-----------------------------------------------
- There is a Redux flag `isFetch` used to re-fetch members.

- After dispatching the new member and posting to the backend,
  call:
  dispatch(setIsFetch());

- This will trigger the `useEffect` which re-fetches the members:

  useEffect(() => {
    startTransition(async () => {
      const res = await axios.get(
        `/api/getOrgMembers?organizationId=${organization.id}`
      );
      const { orgMemebers } = res.data;
      dispatch(setOrgMembers(orgMemebers));
    });
  }, [isFetch]);

-----------------------------------------------
🗂️ File Location:
Place all this inside `/app/dashboard/TeamMemberCompo.tsx`

-----------------------------------------------
🧠 Summary:
- Use Redux `orgMembers` to list current members.
- Fetch non-org users via `/api/getUsers`.
- Add user by dispatching dummy to Redux and POSTing to `/api/addOrgMember`.
- Call `dispatch(setIsFetch())` to refresh member list.

*/

"use client";
import { useState, useEffect, useMemo } from "react";
import { RootState } from "@/utils/Store";
import React from "react";
import { useSelector } from "react-redux";
import { Mail, Plus, Search } from "lucide-react";
import { OrgMember, User } from "@/utils/DataSlice";
import DialogCompo from "@/components/DialogCompo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "@/components/ui/label";

function TeamMemberCompo() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState<string>("");
  const [allUsers, setAllUsers] = useState([]);

  const organizationId = useSelector(
    (state: RootState) => state.dataSlice.userInfo
  ).organizations[0].id;

  const organizationMembers = useSelector(
    (state: RootState) => state.dataSlice.orgMembers
  );

  const searchUser = useMemo(() => {
    const user = allUsers.filter(
      (u: User) =>
        u.username.toLowerCase().includes(input.trim().toLowerCase()) ||
        u.email.toLowerCase().includes(input.trim().toLowerCase())
    );
    return user;
  }, [input]);
  console.log(searchUser);

  async function fetchAllUsers() {
    const res = await axios.get("/api/getUsers");
    const { success, allUsers } = res.data;
    setAllUsers(allUsers);
  }
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Converting the username's first letter into uppercase;

  function formatString(username: string) {
    let newUsername = username.trim().split(" ");
    newUsername = newUsername.map(
      (username: string) =>
        `${username[0].toUpperCase()}${username.slice(1, username.length)}`
    );
    let concatenatedUsername = newUsername.join(" ");
    return concatenatedUsername;
  }

  function formatDate(dateString: Date) {
    const dateInfo = new Date(dateString);
    const month = dateInfo.getMonth() + 1;
    const year = dateInfo.getFullYear();

    const date = dateInfo.getDate();
    return `${year}-${month}-${date}`;
  }

  function firstLetter(username: string) {
    let userName = username
      .trim()
      .split(" ")
      .map((name) => `${name[0].toUpperCase()}`)
      .join("");

    return userName;
  }
  console.log(searchUser);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 mx-auto main">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0 top-sec">
        <h1 className="text-lg sm:text-xl font-bold text-slate-800">
          Team Members
        </h1>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-xl px-4 py-2 text-sm flex items-center justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizationMembers.map((member: OrgMember) => (
            <TableRow key={member.id}>
              <TableCell>{formatString(member.user.username)}</TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    member.user.role === "ADMIN" && "bg-blue-700 text-white"
                  }`}
                >
                  {member.user.role}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(member.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DialogCompo
        title="Add Team Member"
        discription="Search for users by email and add them to your organization."
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-2 input-field">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-[rgba(0,0,0,0.3)] py-5 focus-visible:ring-[3px]"
            placeholder="Search by email or name"
          />
          <Button
            className="bg-blue-600 py-5 hover:bg-blue-500 cursor-pointer"
            disabled={input === ""}
          >
            <Search />
          </Button>
        </div>

        <div>
          {input !== "" && searchUser.length === 0 ? (
            <div className="flex flex-col gap-2 justify-center items-center text-gray-400 font-semibold text-lg">
              <Mail size={42} />
              No users found with that email
            </div>
          ) : (
            searchUser.map((user: User) => (
              <div
                className="flex items-center gap-2 mb-3 rounded-sm p-2 border-1 border-[rgba(0,0,0,0.5)] cursor-pointer"
                key={user.id}
              >
                <div className="bg-blue-200 text-blue-900 text-[1rem] p-2 rounded-[50%] pfp">
                  <span>{firstLetter(user.username)}</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-sm font-medium">{user.username}</h2>
                  <h2 className="text-[0.7rem] text-gray-500">{user.email}</h2>
                </div>
                <div className="select"></div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button className="px-4 py-2 cursor-pointer border-1 border-[rgba(0,0,0,0.1)] rounded-sm hover:bg-gray-100">
            Cancel
          </button>
          <Button
            disabled={input === ""}
            className="p-3 py-2 cursor-pointer rounded-sm text-white bg-blue-600"
          >
            Add Members
          </Button>
        </div>
      </DialogCompo>
    </div>
  );
}

export default TeamMemberCompo;
