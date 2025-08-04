import axios from "axios";
import { Cart } from "@/types/cart.type";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const clearCart = async (cart: Cart) => {
  return axios.put(`${BASE_URL}/carts/${cart.id}`, {
    ...cart,
    items: [],
    totalPrice: 0,
  });
};
