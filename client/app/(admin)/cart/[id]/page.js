import CartDetailsClient from "../../../components/admin/CartDetailsClient";

async function getCartById(id) {
  // In real app: fetch from DB (MongoDB / Prisma / API)
  return {
    id,
    userId: 'user_001',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+1 (555) 123-4567',
    items: [
      {
        productId: 1,
        title: 'Wireless Bluetooth Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
        quantity: 2,
        price: 99.99,
        variants: { color: 'Black', size: 'M' }
      },
      {
        productId: 2,
        title: 'Smart Fitness Watch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
        quantity: 1,
        price: 199.99,
        variants: { color: 'Silver', size: 'M' }
      }
    ],
    totalItems: 3,
    subtotal: 399.97,
    tax: 36.0,
    shipping: 0,
    totalPrice: 435.97,
    status: 'active',
    createdAt: '2024-01-15 10:30:00',
    lastUpdated: '2024-01-15 14:20:00',
    recoveryEmailsSent: 1,
    lastRecoveryEmail: '2024-01-15 12:00:00',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    timeline: [
      {
        action: 'Cart Created',
        timestamp: '2024-01-15 10:30:00',
        type: 'create',
        description: 'Customer started shopping'
      }
    ]
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const cart = await getCartById(id);

  return <CartDetailsClient cart={cart} />;
}