/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import axios from "axios";
import { toast } from "sonner";
import { useAddToCart } from "./useAddToCart";
import { useCartStore } from "@/stores/cart.store";
import { Product } from "@/types/product.types";

jest.mock("axios");
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/stores/cart.store", () => ({
  useCartStore: jest.fn(),
}));

const makeCartStoreMock = (state: any) => {
  (useCartStore as unknown as jest.Mock).mockImplementation(
    (selector?: any) => {
      return typeof selector === "function" ? selector(state) : state;
    }
  );
};

describe("useAddToCart", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedToast = toast as jest.Mocked<typeof toast>;
  const mockSetCart = jest.fn();
  const mockSetIsChange = jest.fn();

  const mockProduct: Product = {
    status: "available",
    reviewCount: 10,
    id: "p1",
    name: "Product 1",
    price: 100,
    originalPrice: 120,
    image: "",
    category: "Category 1",
    description: "Description 1",
    rating: 4.5,
    reviews: 100,
    stock: 50,
    features: ["Feature 1", "Feature 2"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_BASE = "http://localhost";
  });

  it("hiển thị lỗi khi product null", async () => {
    makeCartStoreMock({
      cart: { items: [], totalPrice: 0 },
    });

    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(null);
    });

    expect(mockedToast.error).toHaveBeenCalledWith("Sản phẩm không hợp lệ!");
  });

  it("hiển thị lỗi khi không có giỏ hàng", async () => {
    makeCartStoreMock({
      cart: null,
    });

    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(mockProduct);
    });

    expect(mockedToast.error).toHaveBeenCalledWith(
      "Không tìm thấy giỏ hàng! Vui lòng đăng nhập"
    );
  });

  it("hiển thị info khi sản phẩm đã tồn tại", async () => {
    makeCartStoreMock({
      cart: { items: [{ productId: "p1" }], totalPrice: 100 },
    });

    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(mockProduct);
    });

    expect(mockedToast.info).toHaveBeenCalledWith(
      "Sản phẩm đã có trong giỏ hàng."
    );
  });

  it("thêm sản phẩm thành công", async () => {
    makeCartStoreMock({
      cart: { id: "c1", items: [], totalPrice: 0 },
      setCart: mockSetCart,
      setIsChange: mockSetIsChange,
    });

    mockedAxios.patch.mockResolvedValueOnce({});

    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(mockProduct);
    });

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      "http://localhost/carts/c1",
      expect.objectContaining({
        items: expect.any(Array),
        totalPrice: 100,
      })
    );
    expect(mockSetCart).toHaveBeenCalled();
    expect(mockSetIsChange).toHaveBeenCalledWith(true);
    expect(mockedToast.success).toHaveBeenCalledWith("Đã thêm vào giỏ hàng!");
  });

  it("hiển thị lỗi khi gọi API thất bại", async () => {
    makeCartStoreMock({
      cart: { id: "c1", items: [], totalPrice: 0 },
      setCart: mockSetCart,
      setIsChange: mockSetIsChange,
    });

    mockedAxios.patch.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useAddToCart());

    await act(async () => {
      await result.current(mockProduct);
    });

    expect(mockedToast.error).toHaveBeenCalledWith(
      "Thêm vào giỏ hàng thất bại."
    );
  });
});
