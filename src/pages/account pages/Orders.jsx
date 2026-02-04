import React, { useState, useEffect } from 'react'
import {
  LuArrowLeft,
  LuSearch
} from "react-icons/lu";
import { useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

function Orders() {
  const { setIsSidebarOpen } = useOutletContext();
  const { allOrders } = useSelector((state) => state.orderSlice);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tabs, settabs] = useState([
    { id: "all", label: "All", status: null },
    { id: "pending", label: "To Pay", status: "pending" },
    { id: "shipped", label: "To ship", status: "shipped" },
    { id: "delivered", label: "To Receive", status: "delivered" },
    { id: "review", label: "To Review", status: "review", count: 0 }
  ])

  // Filter orders based on active tab and search
  const filteredOrders = allOrders.filter(order => {
    let matchesTab;

    if (activeTab === "all") {
      matchesTab = true;
    }
    else if (activeTab === "review") {
      const items = order?.items?.every((i) => i.isReviewed == false);

      matchesTab = order.orderStatus === "delivered" && items;
    } else {
      matchesTab = order.orderStatus === tabs.find(t => t.id === activeTab)?.status
    }

    const matchesSearch = searchQuery === "" ||
      order.orderId?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      order.sellerName?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      order.items.some(p => p.name.toLowerCase().includes(searchQuery?.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "To Ship":
        return "bg-blue-100 text-blue-700";
      case "To Pay":
        return "bg-orange-100 text-orange-700";
      case "To Receive":
        return "bg-purple-100 text-purple-700";
      case "To Review":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    let count = 0;
    allOrders.forEach((order) => {
      let unReviewedOrder = order?.items.every((i) => i.isReviewed == false);
      if (order.orderStatus==="delivered"&&unReviewedOrder) {
        count += 1;
      }
    });
    settabs([
      { id: "all", label: "All", status: null },
      { id: "pending", label: "To Pay", status: "pending" },
      { id: "shipped", label: "To ship", status: "shipped" },
      { id: "delivered", label: "To Receive", status: "delivered" },
      { id: "review", label: "To Review", status: "review", count: count }
    ])
  }, [ allOrders])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <LuArrowLeft size={24} onClick={() => setIsSidebarOpen(true)} className='lg:hidden' />
        <h2 className="text-2xl font-bold text-text2">My Orders </h2>
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors duration-300 border-b-2 ${activeTab === tab.id
                ? "border-btn2 text-btn2"
                : "border-transparent text-text1 hover:text-text2"
                }`}
            >
              {tab.label} {" "}
              {tab.count && (
                <span className="ms-1">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>


      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by seller name, order ID or product name"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Orders List */}
      <div>
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-text1 text-lg">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link to={`/account/order/${order._id}`} key={order.orderId}>
              <div className="p-4 bg-primary cursor-pointer my-3">
                {/* Order Header */}
                <div className="flex items-center justify-end mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* Products */}
                <div className="space-y-4">
                  {order.items.map((product) => (
                    <div key={product._id} className="flex gap-4">
                      {/* Product Image */}

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
                      />

                      {/* Product Details */}
                      <div className="flex flex-col sm:flex-row sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p>{product.name}</p>
                          <div className="text-sm text-text1 mt-1 space-y-1">
                            {product.size && <p>Size: {product.size}</p>}
                            {product.color && <p>Color: {product.color}</p>}
                          </div>
                        </div>

                        {/* Price & Quantity */}
                        <div className="text-right shrink-0s">
                          <p className="text-lg font-bold text-text2 mb-1">
                            Rs. {product.price}
                          </p>
                          <p className="text-sm text-text1">
                            Qty: {product.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders