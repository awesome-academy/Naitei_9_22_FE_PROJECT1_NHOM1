import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/user.types";

export const useUser = (userId: string) => {
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  return user;
};
=======
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE}/users/${userId}`
                );
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [userId]);

    return user;
};
>>>>>>> 22d7f6e (feat: cập nhật giao diện và chức năng trang ưa thích)
