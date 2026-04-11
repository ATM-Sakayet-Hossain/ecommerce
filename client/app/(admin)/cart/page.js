import CartsClient from "../../components/admin/CartsClient";

// Mock or replace with real DB/API call (MongoDB, Prisma, etc.)
async function getCarts() {
  return [
    {
      id: 1,
      userName: "John Doe",
      userEmail: "john@example.com",
      status: "active",
      createdAt: "2026-04-10T10:00:00Z",
      lastUpdated: "2026-04-11T08:30:00Z",
      totalPrice: 120.5,
      totalItems: 3,
      items: [
        { title: "iPhone 15", quantity: 1, price: 100 },
        { title: "Case", quantity: 2, price: 10 },
        { title: "Headphones", quantity: 1, price: 59.99 },
        { title: "Cable", quantity: 1, price: 30 }
      ]
    },
    {
      id: 2,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      status: "abandoned",
      createdAt: "2026-04-09T12:00:00Z",
      lastUpdated: "2026-04-10T09:00:00Z",
      totalPrice: 89.99,
      totalItems: 2,
      items: [
        { title: "Headphones", quantity: 1, price: 59.99 },
        { title: "Cable", quantity: 1, price: 30 },
        { title: "iPhone 15", quantity: 1, price: 100 },
        { title: "Case", quantity: 2, price: 10 }
      ]
    }
  ];
}

export default async function Page() {
  const carts = await getCarts(); // SSR data fetching

  return <CartsClient initialCarts={carts} />;
}