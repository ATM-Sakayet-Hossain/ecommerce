import React from "react";
import CardBody from "../../components/ui/CardBody";
import { LuShoppingBag, LuUserRound, LuUsers } from "react-icons/lu";
import { VscArchive, VscBrowser } from "react-icons/vsc";
import { TiShoppingCart } from "react-icons/ti";
import { RxCrossCircled } from "react-icons/rx";
import { MdLocalShipping } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi";
import { BsGift } from "react-icons/bs";
import { RiCoupon2Line } from "react-icons/ri";
import { GiSettingsKnobs } from "react-icons/gi";
import UsersBarChart from "../../components/ui/UsersBarChart";
import OrdersTable from "../../components/admin/OrdersTable";
import RecentlyAddProducts from "../../components/admin/RecentlyAddProducts";

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
  return (
    <div className="h-[calc(100vh-5.8rem)] overflow-y-auto scrollbar-hide">
      <div className="grid gap-4">
        <h2>dashboard</h2>
        <div className="grid grid-cols-4 gap-5">
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<HiOutlineHome size={50} color="#fff" />}
            title="Total Stores"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<MdLocalShipping size={50} color="#fff" />}
            title="Total Products"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<TiShoppingCart size={50} color="#fff" />}
            title="Total Orders"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<RxCrossCircled size={50} color="#fff" />}
            title="Total Cancelled Orders"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<LuShoppingBag size={50} color="#fff" />}
            title="Total Categories"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<LuUserRound size={50} color="#fff" />}
            title="Total Users"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<RiCoupon2Line size={50} color="#fff" />}
            title="Total Coupons"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<VscBrowser size={50} color="#fff" />}
            title="Pending Payouts"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<BsGift size={50} color="#fff" />}
            title="Total Special offers"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<LuUsers size={50} color="#fff" />}
            title="Total Coustomer"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<GiSettingsKnobs size={50} color="#fff" />}
            title="Total Testimonials"
            total="49"
          />
          <CardBody
            style={{ backgroundColor: "#F56954" }}
            icon={<VscArchive size={50} color="#fff" />}
            title="Total Hotdeals"
            total="49"
          />
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
