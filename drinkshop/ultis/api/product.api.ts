import axios from "axios";
import { Product } from "@/types/product.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const fetchProduct = async (id: string): Promise<Product | null> => {
    const res = await axios.get(`${BASE_URL}/products/${id}`);
    return res.data[0] || null;
};
