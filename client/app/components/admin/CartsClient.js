"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  ShoppingCart,
  User,
  DollarSign,
  Package,
} from "lucide-react";
import Input from "../ui/input";
import CardBody from "../ui/CardBody";

export default function CartsClient({ initialCarts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statuses = ["active", "abandoned", "converted"];

  const filteredCarts = initialCarts.filter((cart) => {
    const matchesSearch =
      cart.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || cart.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-blue-100 text-blue-800",
      abandoned: "bg-red-100 text-red-800",
      converted: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 p-4 bg-green-50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Carts</h1>
          <p className="text-gray-600">
            Monitor customer shopping carts and abandoned carts
          </p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <CardBody
          style={{ backgroundColor: "black" }}
          icon={<ShoppingCart size={50} color="#fff" />}
          title="Total Carts"
          total={initialCarts.length}
        />
        <CardBody
          style={{ backgroundColor: "green" }}
          icon={<ShoppingCart size={50} color="#fff" />}
          title="Active"
          total={initialCarts.filter((c) => c.status === "active").length}
        />
        <CardBody
          style={{ backgroundColor: "#F56954" }}
          icon={<ShoppingCart size={50} color="#fff" />}
          title="Abandoned"
          total={initialCarts.filter((c) => c.status === "abandoned").length}
        />
        <CardBody
          style={{ backgroundColor: "green" }}
          icon={<DollarSign size={50} color="#fff" />}
          title="Total Value"
          total={initialCarts
            .reduce((sum, c) => sum + c.totalPrice, 0)
            .toFixed(0)}
        />
      </div>
      {/* Filters */}
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Cart List */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredCarts.map((cart) => (
          <div
            key={cart.id}
            className="border border-blue-400 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-50 bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium">{cart.userName}</h3>
                    {getStatusBadge(cart.status)}
                  </div>

                  <p className="text-sm text-gray-500">{cart.userEmail}</p>

                  <div className="text-sm text-gray-500 mt-1 space-x-2">
                    <span>Cart #{cart.id}</span>
                    <span>•</span>
                    <span>Created {formatDate(cart.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">
                  ${cart.totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{cart.totalItems} items</p>

                <Link
                  href={`/cart/${cart.id}`}
                  className="btn-primary inline-flex items-center text-sm mt-2"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </div>
            </div>
            {/* Items */}
            <div className="mt-4 pt-4 border-t border-blue-400">
              <h4 className="text-sm font-medium mb-2">Items:</h4>

              <div className="space-y-2">
                {cart.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{item.title}</span>
                      <span className="text-gray-500">X {item.quantity}</span>
                    </div>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty */}
      {filteredCarts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No carts found</h3>
        </div>
      )}
    </div>
  );
}
