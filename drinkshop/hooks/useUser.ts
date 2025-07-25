import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "./../types/user.types";

export const useUser = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?id=${userId}`
        );
        setUser(response.data[0]);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  return user;
};
