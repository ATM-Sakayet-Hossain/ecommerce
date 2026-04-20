import React from "react";
import { LuShoppingBag, LuUserRound, LuUsers } from "react-icons/lu";
import { VscArchive, VscBrowser } from "react-icons/vsc";
import { TiShoppingCart } from "react-icons/ti";
import { RxCrossCircled } from "react-icons/rx";
import { MdLocalShipping } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi";
import { BsGift } from "react-icons/bs";
import { RiCoupon2Line } from "react-icons/ri";
import { GiSettingsKnobs } from "react-icons/gi";
import CardBody from "@/components/admin/CardBody";
import UsersBarChart from "@/components/admin/UsersBarChart";
import OrdersTable from "@/components/admin/OrdersTable";
import RecentlyAddProducts from "@/components/admin/RecentlyAddProducts";

const Dashboard = () => {
  const salesSeries = [
    {
      name: "Sales",
      data: [10, 15, 8, 20, 25, 18, 30, 28, 22, 35, 40, 50],
    },
  ];
  const usersSeries = [
    {
      name: "Users",
      data: [5, 12, 9, 18, 22, 16, 27, 30, 25, 32, 38, 45],
    },
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const orders = [
    {
      id: "1",
      name: "Order #1 - Gaming Setup",
      description: "ASUS Mothership X Laptop + Accessories Bundle",
      price: 50,
      currency: "USD",
      image: "/order1.png",
    },
    {
      id: "2",
      name: "Order #2 - Sports Pack",
      description: "Premium Cricket Bat Package",
      price: 280,
      currency: "USD",
      image: "/order2.png",
    },
  ];

  const dashboardCards = [
    { icon: HiOutlineHome, title: "Total Stores", total: "49" },
    { icon: MdLocalShipping, title: "Total Products", total: "49" },
    { icon: TiShoppingCart, title: "Total Orders", total: "49" },
    { icon: RxCrossCircled, title: "Total Cancelled Orders", total: "49" },
    { icon: LuShoppingBag, title: "Total Categories", total: "49" },
    { icon: LuUserRound, title: "Total Users", total: "49" },
    { icon: RiCoupon2Line, title: "Total Coupons", total: "49" },
    { icon: VscBrowser, title: "Pending Payouts", total: "49" },
    { icon: BsGift, title: "Total Special offers", total: "49" },
    { icon: LuUsers, title: "Total Coustomer", total: "49" },
    { icon: GiSettingsKnobs, title: "Total Testimonials", total: "49" },
    { icon: VscArchive, title: "Total Hotdeals", total: "49" },
  ];

  return (
    <div className="h-[calc(100vh-6.5rem)] overflow-y-auto overflow-hidden scrollbar-hidden grid w-full gap-4 pb-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-4 gap-5">
          {dashboardCards.map(({ icon: Icon, title, total }) => (
            <CardBody
              key={title}
              style={{ backgroundColor: "#F56954" }}
              icon={<Icon size={50} color="#fff" />}
              title={title}
              total={total}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5 py-5">
          <UsersBarChart
            title="Monthly Sales Report 2026"
            categories={months}
            series={salesSeries}
            colors={["#ff4d6d"]}
          />
          <UsersBarChart
            title="Monthly Users Growth 2026"
            categories={months}
            series={usersSeries}
            colors={["#4f46e5"]}
          />
        </div>
        <OrdersTable orders={orders} />
        <RecentlyAddProducts />
      </div>
    </div>
  );
};

export default Dashboard;
