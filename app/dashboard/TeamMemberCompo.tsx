"use client";
import { RootState } from "@/utils/Store";
import React from "react";
import { useSelector } from "react-redux";

function TeamMemberCompo() {
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);
  console.log(userInfo);

  return <div>TeamMemberCompo</div>;
}

export default TeamMemberCompo;
