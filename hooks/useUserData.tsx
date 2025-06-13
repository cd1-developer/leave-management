"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setUserInfo } from "@/utils/DataSlice";
import { User } from "@/utils/DataSlice";
export const useUserData = () => {
  const { data: session } = useSession();
  const [userInfo, setuserInfo] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchuserInfo = async () => {
      try {
        setLoading(true);
        if (!session?.user?.id) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`/api/getUser?id=${session.user.id}`);
        const { success, userInfo, message } = res.data;

        if (success && userInfo) {
          setuserInfo(userInfo);
        } else {
          setError(message || "Failed to fetch user data");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchuserInfo();
  }, [session?.user?.id]); // Only re-run if user ID changes

  useEffect(() => {
    if (userInfo) {
      dispatch(setUserInfo(userInfo));
    }
  }, [dispatch, userInfo]);

  return { userInfo, loading, error };
};
