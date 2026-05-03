import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/widgets/app-layout";
import { EditOrderPage } from "@/pages/orders/edit-order-page";
import { NewOrderPage } from "@/pages/orders/new-order-page";
import { OrderDetailPage } from "@/pages/orders/order-detail-page";
import { OrdersPage } from "@/pages/orders/orders-page";
import { routes } from "@/shared/config/routes";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={routes.orders} replace /> },
      { path: routes.orders, element: <OrdersPage /> },
      { path: routes.newOrder, element: <NewOrderPage /> },
      { path: routes.orderDetail(":orderId"), element: <OrderDetailPage /> },
      { path: routes.editOrder(":orderId"), element: <EditOrderPage /> },
    ],
  },
]);
