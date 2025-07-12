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
- Add user by dispatching dummy to Redux and POST to `/api/addOrgMember`.
- Call `dispatch(setIsFetch())` to refresh member list.

*/

"use client";
import { useState, useEffect, useMemo, useTransition } from "react";
import { RootState } from "@/utils/Store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, Mail, Plus, Search, X } from "lucide-react";
import { OrgMember, setIsFetch, setOrgMembers, User } from "@/utils/DataSlice";
import DialogCompo from "@/components/DialogCompo";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import axios from "axios";

import { toast } from "sonner";

import TeamMemberTabel from "@/components/TeamMemberTabel";
import TeamMemberCard from "@/components/TeamMemberCard";

function TeamMemberCompo() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState<string>("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User[] | []>([]);
  const [isPending, startTransition] = useTransition();
  // const [checkedUser, setCheckedUser] = useState([]);
  const organization = useSelector(
    (state: RootState) => state.dataSlice.organization
  );

  const organizationMembers = useSelector(
    (state: RootState) => state.dataSlice.orgMembers
  );

  const organizationId = organization.id;

  const searchUser = useMemo(() => {
    const user =
      input === ""
        ? []
        : allUsers.filter(
            (u: User) =>
              u.username.toLowerCase().includes(input.trim().toLowerCase()) ||
              u.email.toLowerCase().includes(input.trim().toLowerCase())
          );

    return user;
  }, [input]);

  async function fetchAllUsers() {
    const res = await axios.get("/api/getUsers");
    const { success, allUsers } = res.data;
    setAllUsers(allUsers);
  }
  useEffect(() => {
    fetchAllUsers();
  }, []);

  function addMember() {
    startTransition(async () => {
      const newMembers = selectedUser.map((user: User) => {
        // Adding member data in redux store and then send it to the database for fast response
        let newMember = {
          id: crypto.randomUUID(),
          organizationId,
          userId: user.id,
          user: { ...user, role: "MEMBER" },
          organization,
          managedBy: [],
          createdAt: new Date(),
        } as OrgMember;
        return newMember;
      });
      try {
        const responses = await Promise.all(
          selectedUser.map((user: User) =>
            axios.post("/api/addOrgMember", {
              userId: user.id,
              organizationId,
            })
          )
        );
        let hasError = false;
        responses.forEach((res) => {
          const { success, message } = res.data;
          if (!success) {
            hasError = true;
            toast.error(message || "Failed to add member", {
              position: "bottom-right",
              duration: 3000,
              className: "bg-red-700 text-white border border-red-600",
            });
          }
        });

        if (!hasError) {
          toast.success("All members added successfully", {
            position: "bottom-right",
            duration: 3000,
            className: "bg-green-700 text-white border border-green-600",
          });
        }
        dispatch(setOrgMembers([...organizationMembers, ...newMembers]));
        setIsOpen(false);
        setInput("");
      } catch (error: any) {
        console.error("Error in adding member in Organization:", error.message);
        toast.error("An error occurred while adding members", {
          position: "bottom-right",
          duration: 3000,
          className: "bg-red-700 text-white border border-red-600",
        });
      }
    });
  }

  // Converting the username's first letter into uppercase;

  function firstLetter(username: string) {
    let userName = username
      .trim()
      .split(" ")
      .map((name) => `${name[0].toUpperCase()}`)
      .join("");

    return userName;
  }

  function selectUserHandler(user: User) {
    setSelectedUser((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      }
      return [...prev, user];
    });
  }

  function handleRemoveUser(user: User) {
    setSelectedUser((prev) => {
      return prev.filter((u) => u.id !== user.id);
    });
  }

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
      {/* For desktop */}
      <div className="hidden sm:block">
        <TeamMemberTabel organizationMembers={organizationMembers} />
      </div>
      <div className="flex flex-col gap-6 sm:hidden">
        {organizationMembers.map((memeber: OrgMember) => (
          <TeamMemberCard key={memeber.id} member={memeber} />
        ))}
      </div>

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

        {selectedUser.length > 0 && (
          <div className="mb-3 selected-user">
            <p className="text-gray-500 font-medium my-2">Selected Users</p>
            <ul className="flex items-center flex-wrap gap-2">
              {selectedUser.map((user: User) => (
                <li
                  key={user.id}
                  className="text-[0.8rem] flex items-center justify-center font-medium bg-blue-100 transition duration-200 hover:bg-transparent px-3 pt-1 gap-2 rounded-4xl"
                >
                  <span className="mb-1">{user.username}</span>
                  <span
                    onClick={() => handleRemoveUser(user)}
                    className="cursor-pointer rounded-[50%] p-1 hover:bg-blue-100"
                  >
                    <X size={12} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          {input !== "" && searchUser.length === 0 ? (
            <div className="flex flex-col gap-2 justify-center items-center text-gray-400 font-semibold text-lg">
              <Mail size={42} />
              No users found with that email
            </div>
          ) : (
            searchUser.map((user: User) => (
              <div
                className={`relative flex items-center gap-2 mb-3 rounded-sm p-2 border-1 border-gray-300 cursor-pointer
                  ${
                    selectedUser.some((u: User) => u.id === user.id)
                      ? "bg-blue-100"
                      : "bg-white"
                  }
                  `}
                key={user.id}
                onClick={() => selectUserHandler(user)}
              >
                <div className="bg-blue-200 text-blue-900 text-[1rem] p-2 rounded-[50%] pfp">
                  <span>{firstLetter(user.username)}</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-sm font-medium">{user.username}</h2>
                  <h2 className="text-[0.7rem] text-gray-500">{user.email}</h2>
                </div>
                <div
                  className={`w-[1.2rem] h-[1.2rem] absolute right-4 flex items-center justify-center outline-[1px] rounded-[50%] outline-[rgba(0,0,0,0.4)] text-white ${
                    selectedUser.some((u: User) => u.id === user.id)
                      ? "bg-blue-500"
                      : "bg-white"
                  }`}
                >
                  <Check size={32} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 cursor-pointer border-1 border-[rgba(0,0,0,0.1)] rounded-sm hover:bg-gray-100"
            onClick={() => {
              setInput("");
              setIsOpen(false);
            }}
          >
            Cancel
          </button>
          <Button
            disabled={selectedUser.length === 0 || isPending === true}
            className="p-3 py-2 cursor-pointer rounded-sm text-white bg-blue-600"
            onClick={addMember}
          >
            {isPending ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Adding member...
              </div>
            ) : (
              <div className="flex gap-2 items-center">Add Member</div>
            )}
          </Button>
        </div>
      </DialogCompo>
    </div>
  );
}

export default TeamMemberCompo;
