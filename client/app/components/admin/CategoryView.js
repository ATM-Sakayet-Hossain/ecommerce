'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Eye,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function CategoryView({ category, products }) {
  const router = useRouter();

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-gray-600">Category details</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn-secondary flex items-center">
            <Edit className="h-4 w-4 mr-2" /> Edit
          </button>

          <button className="btn-danger flex items-center">
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              Category Information
            </h3>

            <p>{category.description}</p>

            <div className="mt-4">
              Status: {getStatusBadge(category.status)}
            </div>
          </div>

          {/* Products */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              Products
            </h3>

            {products.map((p) => (
              <div key={p.id} className="flex gap-4 p-3 bg-gray-50 rounded">
                <img src={p.image} className="w-16 h-16 rounded" />

                <div className="flex-1">
                  <h4>{p.title}</h4>
                  <p className="text-sm text-gray-500">
                    ${p.price} • Stock: {p.stock}
                  </p>
                </div>

                <Link href={`/products/${p.id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="card">
            <img src={category.image} className="w-full h-48 rounded" />
          </div>

          <div className="card space-y-3">
            <div className="flex justify-between">
              <span>Total Products</span>
              <span>{category.productCount}</span>
            </div>

            <div className="flex justify-between">
              <span>Revenue</span>
              <span>${category.totalRevenue}</span>
            </div>

            <div className="flex justify-between">
              <span>Rating</span>
              <span>{category.avgRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}