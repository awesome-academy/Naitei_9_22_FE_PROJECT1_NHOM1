export type UserRole = "admin" | "customer";
export type UserStatus = "active" | "inactive";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
}

export interface Address {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  country: string;
  city: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UsersResponse extends ApiResponse<User[]> { }
export interface UserResponse extends ApiResponse<User> { }
export interface AddressesResponse extends ApiResponse<Address[]> { }
export interface AddressResponse extends ApiResponse<Address> { }
