export const routes = {
  orders: "/orders",
  newOrder: "/orders/new",
  orderDetail: (orderId: string) => `/orders/${orderId}`,
  editOrder: (orderId: string) => `/orders/${orderId}/edit`,
};
