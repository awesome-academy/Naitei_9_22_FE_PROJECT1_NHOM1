export interface Order {
  id: number;
  userId: number;
  addressId: number;
  status: string;
  store: string;
  totalPrice: number;
  totalItem: number;
  shippingFee: number;
  discount: number;
  paymentMethod: string;
  orderDate: string;
  updatedAt: string;
}

export interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
}
