import { useEffect, useState } from "react";
import { Address } from "@/types/user.types";
import axios from "axios";

export const useAddress = (userId: string) => {
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDefaultAddress = async () => {
      console.log(
        "Fetching address for userId:",
        `${process.env.NEXT_PUBLIC_API_BASE}/addresses?userId=${userId}&isDefault=true`
      );
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/addresses?userId=${userId}&isDefault=true`
        );
        setAddress(response.data[0] || null);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchDefaultAddress();
  }, [userId]);

  return {
    address,
  };
};
