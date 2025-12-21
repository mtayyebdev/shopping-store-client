import React, { useState } from 'react'
import {
  LuArrowLeft,
  LuSearch
} from "react-icons/lu";
import { useOutletContext } from 'react-router-dom'

function Orders() {
  const { setIsSidebarOpen } = useOutletContext()
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders] = useState([
    {
      id: "ORD123456",
      sellerId: "BBUY",
      sellerName: "BBUY.",
      status: "Completed",
      date: "2024-01-15",
      products: [
        {
          id: 1,
          name: "bbuy pack of 3 kids multi color sandos kids clothing set",
          image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=200&q=80",
          price: 702,
          quantity: 1,
          size: "Int:2-3 yrs",
          color: "Family:Indigo"
        }
      ]
    },
    {
      id: "ORD123455",
      sellerId: "TECH",
      sellerName: "TechStore",
      status: "To Ship",
      date: "2024-01-14",
      products: [
        {
          id: 2,
          name: "Premium Wireless Headphones",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
          price: 2999,
          quantity: 1,
          size: "",
          color: "Black"
        },
        {
          id: 3,
          name: "Smart Watch Pro",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
          price: 5499,
          quantity: 1,
          size: "",
          color: "Silver"
        }
      ]
    },
    {
      id: "ORD123454",
      sellerId: "FASH",
      sellerName: "Fashion Hub",
      status: "To Pay",
      date: "2024-01-13",
      products: [
        {
          id: 4,
          name: "Designer Leather Bag",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80",
          price: 3999,
          quantity: 2,
          size: "Medium",
          color: "Brown"
        }
      ]
    },
    {
      id: "ORD123453",
      sellerId: "SPORT",
      sellerName: "Sports Arena",
      status: "To Receive",
      date: "2024-01-12",
      products: [
        {
          id: 5,
          name: "Running Shoes Elite",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
          price: 4599,
          quantity: 1,
          size: "UK 9",
          color: "Blue"
        }
      ]
    },
    {
      id: "ORD123452",
      sellerId: "BBUY",
      sellerName: "BBUY.",
      status: "To Review",
      date: "2024-01-10",
      products: [
        {
          id: 6,
          name: "Bluetooth Speaker Portable",
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&q=80",
          price: 1999,
          quantity: 1,
          size: "",
          color: "Black"
        }
      ]
    }
  ]);

  const tabs = [
    { id: "all", label: "All", status: null },
    { id: "toPay", label: "To Pay", status: "To Pay" },
    { id: "toShip", label: "To ship", status: "To Ship" },
    { id: "toReceive", label: "To Receive", status: "To Receive" },
    { id: "toReview", label: "To Review", status: "To Review", count: 1 }
  ];

  // Filter orders based on active tab and search
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === "all" || order.status === tabs.find(t => t.id === activeTab)?.status;
    const matchesSearch = searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
              {tab.label}
              {tab.count && (
                <span className="ml-1">({tab.count})</span>
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
            <div key={order.id} className="p-4 bg-primary cursor-pointer my-3">
              {/* Order Header */}
              <div className="flex items-center justify-end mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Products */}
              <div className="space-y-4">
                {order.products.map((product) => (
                  <div key={product.id} className="flex gap-4">
                    {/* Product Image */}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
                    />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      {product.name}
                      <div className="text-sm text-text1 mt-1 space-y-1">
                        {product.size && <p>Size: {product.size}</p>}
                        {product.color && <p>Color: {product.color}</p>}
                      </div>
                    </div>

                    {/* Price & Quantity */}
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-text2 mb-1">
                        Rs. {product.price}
                      </p>
                      <p className="text-sm text-text1">
                        Qty: {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders