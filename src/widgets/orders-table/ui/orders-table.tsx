import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ChangeStatusDropdown } from "@/features/change-order-status";
import { useDeleteOrder } from "@/features/delete-order";
import { RouteLabel, formatDate, formatRate, getPickupDate, type Order } from "@/entities/order";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";

type OrdersTableProps = {
  orders: Order[];
  isLoading: boolean;
};

const columns = [
  "Reference #",
  "Status",
  "Route",
  "Carrier",
  "Equipment",
  "Pickup Date",
  "Rate",
  "Stops",
  "Actions",
];

export function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Orders</h2>
          <p className="text-sm text-slate-500">Database of wire tenders</p>
        </div>
        <Button asChild>
          <Link to={routes.newOrder}>
            <Plus className="size-4" />
            Create New Order
          </Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? <OrdersTableSkeleton /> : orders.map((order) => <OrdersTableRow key={order.id} order={order} />)}
            {!isLoading && orders.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                  No orders found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTableSkeleton() {
  return Array.from({ length: 6 }).map((_, index) => (
    <tr key={index}>
      {columns.map((column) => (
        <td key={column} className="px-4 py-4">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  ));
}

function OrdersTableRow({ order }: { order: Order }) {
  const navigate = useNavigate();
  const deleteOrder = useDeleteOrder();

  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-slate-50"
      onClick={() => navigate(routes.orderDetail(order.id))}
    >
      <td className="px-4 py-4 font-medium text-slate-900">{order.referenceNumber}</td>
      <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
        <ChangeStatusDropdown orderId={order.id} status={order.status} />
      </td>
      <td className="px-4 py-4">
        <RouteLabel order={order} />
      </td>
      <td className="px-4 py-4 text-slate-600">{order.carrierName}</td>
      <td className="px-4 py-4 text-slate-600">{order.equipmentType}</td>
      <td className="px-4 py-4 text-slate-600">{formatDate(getPickupDate(order))}</td>
      <td className="px-4 py-4 font-medium text-slate-900">{formatRate(order.rate)}</td>
      <td className="px-4 py-4 text-slate-600">{order.stops.length}</td>
      <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Order actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={routes.editOrder(order.id)}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              disabled={deleteOrder.isPending}
              onClick={() => deleteOrder.mutate(order.id)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
