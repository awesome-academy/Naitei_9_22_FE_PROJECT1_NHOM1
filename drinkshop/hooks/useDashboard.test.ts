/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import { useDashboard } from "./useDashboard";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const OLD_ENV = process.env;
const API_BASE = "http://localhost";

describe("useDashboard hook", () => {
  const mockUsers = [
    { id: 1, name: "User A" },
    { id: 2, name: "User B" },
  ];

  const mockOrders = [
    {
      id: 1,
      status: "Đã hoàn thành",
      totalPrice: 100,
      orderDate: new Date().toISOString(),
    },
    {
      id: 2,
      status: "Đang xử lý",
      totalPrice: 200,
      orderDate: new Date().toISOString(),
    },
  ];

  const mockComments = [
    { id: 1, text: "Great!" },
    { id: 2, text: "Ok" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_BASE: API_BASE };
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore
  });

  it("fetches and sets dashboard data successfully", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUsers }) // /users
      .mockResolvedValueOnce({ data: mockOrders }) // /orders
      .mockResolvedValueOnce({ data: mockComments }); // /comments

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.stats).toBeTruthy());
    await waitFor(() => expect(result.current.chartData).toBeTruthy());

    expect(result.current.error).toBeNull();
    expect(result.current.stats).toEqual({
      totalUsers: 2,
      totalOrders: 2,
      totalRevenue: 100, // chỉ tính đơn đã hoàn thành
      totalComments: 2,
    });

    expect(result.current.chartData?.labels).toHaveLength(7);
    expect(result.current.chartData?.revenue).toHaveLength(7);
    expect(result.current.chartData?.orders).toHaveLength(7);
  });

  it("handles partial API failures gracefully", async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("/users")) return Promise.resolve({ data: mockUsers });
      if (url.includes("/orders")) return Promise.resolve({ data: mockOrders });
      if (url.includes("/comments"))
        return Promise.reject(new Error("Comments API error"));
      return Promise.reject(new Error("Unexpected URL: " + url));
    });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.stats).toBeTruthy());

    expect(result.current.error).toBeNull();
    expect(result.current.stats).toMatchObject({
      totalUsers: 2,
      totalOrders: 2,
      totalComments: 0, // comments fail
    });
  });

  it("handles all API failures gracefully", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.stats).toBeTruthy());

    expect(result.current.error).toBeNull();
    expect(result.current.stats).toEqual({
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalComments: 0,
    });

    expect(result.current.chartData?.revenue).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(result.current.chartData?.orders).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it("can refresh data manually", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUsers })
      .mockResolvedValueOnce({ data: mockOrders })
      .mockResolvedValueOnce({ data: mockComments });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.stats).toBeTruthy());

    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUsers })
      .mockResolvedValueOnce({ data: mockOrders })
      .mockResolvedValueOnce({ data: mockComments });

    await act(async () => {
      await result.current.refreshData();
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(6); // 3 lần ban đầu + 3 lần refresh
  });
});
