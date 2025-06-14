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
import { RootState } from "@/utils/Store";
import React from "react";
import { useSelector } from "react-redux";

function TeamMemberCompo() {
  const organizationId = useSelector(
    (state: RootState) => state.dataSlice.userInfo
  ).organizations[0].id;

  const organizationMembers = useSelector(
    (state: RootState) => state.dataSlice.orgMembers
  );

  return <div>TeamMemberCompo</div>;
}

export default TeamMemberCompo;
