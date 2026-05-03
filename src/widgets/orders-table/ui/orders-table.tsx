import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Pencil,
  Plus,
  CopyPlus,
  Eye,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChangeStatusDropdown } from "@/features/change-order-status";
import { useChangeOrderStatus } from "@/features/change-order-status";
import { useDeleteOrder } from "@/features/delete-order";
import {
  EQUIPMENT_TYPE_LABELS,
  ORDER_STATUS_LABELS,
  RouteLabel,
  formatDate,
  formatRate,
  getAllowedOrderStatusTransitions,
  getPickupDate,
  type Order,
  type OrderStatus,
  type OrderSortBy,
  type SortOrder,
} from "@/entities/order";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

type OrdersTableProps = {
  orders: Order[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  sortBy: OrderSortBy;
  sortOrder: SortOrder;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sortBy: OrderSortBy) => void;
  onCreateOrder: () => void;
  onDuplicateOrder: (order: Order) => void;
  onRetry: () => void;
};

const colSpan = 9;

export function OrdersTable({
  orders,
  total,
  isLoading,
  error,
  page,
  pageSize,
  sortBy,
  sortOrder,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onCreateOrder,
  onDuplicateOrder,
  onRetry,
}: OrdersTableProps) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Orders</h2>
          <p className="text-sm text-slate-500">Database of wire tenders</p>
        </div>
        <Button type="button" onClick={onCreateOrder}>
          <Plus className="size-4" />
          Create New Order
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[1050px]">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <SortableHead
                label="Reference #"
                value="referenceNumber"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              />
              <SortableHead
                label="Status"
                value="status"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              />
              <TableHead>Route</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Equipment</TableHead>
              <SortableHead
                label="Pickup Date"
                value="pickupDate"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              />
              <SortableHead
                label="Rate"
                value="rate"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              />
              <TableHead>Stops</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? <OrdersTableSkeleton /> : null}
            {!isLoading && error ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="py-10 text-center">
                  <p className="mb-3 font-medium text-red-600">
                    {error.message}
                  </p>
                  <Button type="button" variant="outline" onClick={onRetry}>
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && !error
              ? orders.map((order) => (
                  <OrdersTableRow
                    key={order.id}
                    order={order}
                    onDuplicateOrder={onDuplicateOrder}
                  />
                ))
              : null}
            {!isLoading && !error && orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="py-10 text-center text-slate-500"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm text-slate-600">
        <span>
          Showing {from}-{to} of {total}
        </span>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-9 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
          >
            Previous
          </Button>
          <span className="px-2">
            {safePage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrdersTableSkeleton() {
  return Array.from({ length: 6 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: colSpan }).map((__, cellIndex) => (
        <TableCell key={cellIndex}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

type SortableHeadProps = {
  label: string;
  value: OrderSortBy;
  sortBy: OrderSortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: OrderSortBy) => void;
};

function SortableHead({
  label,
  value,
  sortBy,
  sortOrder,
  onSortChange,
}: SortableHeadProps) {
  const isActive = sortBy === value;
  const Icon = sortOrder === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead>
      <button
        type="button"
        className="inline-flex items-center gap-1"
        onClick={() => onSortChange(value)}
      >
        {label}
        {isActive ? <Icon className="size-3" /> : null}
      </button>
    </TableHead>
  );
}

function OrdersTableRow({
  order,
  onDuplicateOrder,
}: {
  order: Order;
  onDuplicateOrder: (order: Order) => void;
}) {
  const navigate = useNavigate();
  const deleteOrder = useDeleteOrder();
  const changeStatus = useChangeOrderStatus();
  const allowedTransitions = getAllowedOrderStatusTransitions(order.status);

  const handleDelete = () => {
    if (!window.confirm(`Delete ${order.referenceNumber}?`)) {
      return;
    }

    deleteOrder.mutate(order.id);
  };

  const handleChangeStatus = (nextStatus: OrderStatus) => {
    changeStatus.mutate({
      orderId: order.id,
      currentStatus: order.status,
      nextStatus,
    });
  };

  return (
    <TableRow
      className="cursor-pointer transition-colors hover:bg-slate-50"
      onClick={() => navigate(routes.orderDetail(order.id))}
    >
      <TableCell className="font-medium text-slate-900">
        {order.referenceNumber}
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <ChangeStatusDropdown orderId={order.id} status={order.status} />
      </TableCell>
      <TableCell>
        <RouteLabel order={order} />
      </TableCell>
      <TableCell className="text-slate-600">{order.carrier.name}</TableCell>
      <TableCell className="text-slate-600">
        {EQUIPMENT_TYPE_LABELS[order.equipmentType]}
      </TableCell>
      <TableCell className="text-slate-600">
        {formatDate(getPickupDate(order))}
      </TableCell>
      <TableCell className="font-medium text-slate-900">
        {formatRate(order.rate)}
      </TableCell>
      <TableCell className="text-slate-600">{order.stops.length}</TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Order actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(routes.orderDetail(order.id))}
            >
              <Eye className="size-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={order.status !== "pending"}
              onClick={() => navigate(routes.editOrder(order.id))}
            >
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicateOrder(order)}>
              <CopyPlus className="size-4" />
              Duplicate as Draft
            </DropdownMenuItem>
            {allowedTransitions.map((status) => (
              <DropdownMenuItem
                key={status}
                disabled={changeStatus.isPending}
                onClick={() => handleChangeStatus(status)}
              >
                Change to {ORDER_STATUS_LABELS[status]}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              disabled={deleteOrder.isPending || order.status !== "pending"}
              onClick={handleDelete}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
