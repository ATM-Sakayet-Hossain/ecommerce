import Link from "next/link";
import { formatCurrency, formatDate } from "../UI/helper";

export default function OrdersTable({ orders = [] }) {
  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Latest Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr className="text-gray-500">
              <th className="py-2">#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id || order.orderNumber || order.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-3">{index + 1}</td>

                <td className="text-blue-600 font-medium">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(order.orderNumber || "")}`}
                  >
                    #{String(order.orderNumber || order.id).slice(-8)}
                  </Link>
                </td>
                <td>{order.user?.name || order.customerName || "-"}</td>
                <td>
                  <span className="px-2 py-1 bg-gray-100 rounded-md">
                    {order.totalQty ?? "-"}
                  </span>
                </td>
                <td className="font-semibold">
                  {order.currency
                    ? formatCurrency(order.totalPrice, order.currency)
                    : `৳${Number(order.totalPrice || 0).toLocaleString("en-BD")}`}
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      statusColor[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
