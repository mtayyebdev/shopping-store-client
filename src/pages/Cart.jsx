import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LuMinus,
  LuPlus,
  LuTrash2,
  LuShoppingBag,
  LuTag,
  LuShieldCheck,
} from "react-icons/lu";
import { Button, Input } from '../components/index.js'

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      price: 2999,
      originalPrice: 4999,
      quantity: 1,
      inStock: true,
      selected: true,
    },
    {
      id: 2,
      name: "Smart Watch Pro Series",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
      price: 5499,
      originalPrice: 7999,
      quantity: 2,
      inStock: true,
      selected: true,
    },
    {
      id: 3,
      name: "Designer Leather Bag",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
      price: 3999,
      originalPrice: 6999,
      quantity: 1,
      inStock: true,
      selected: true,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Get selected items
  const selectedItems = cartItems.filter((item) => item.selected);
  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  // Calculate totals (only for selected items)
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = selectedItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal + deliveryCharge - couponDiscount;

  // Toggle item selection
  const toggleItemSelection = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Toggle all items selection
  const toggleAllSelection = () => {
    const newSelectedState = !allSelected;
    setCartItems(
      cartItems.map((item) => ({ ...item, selected: newSelectedState }))
    );
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Delete all items
  const deleteAllItems = () => {
    const action = confirm("Do you want to delete all your items in cart?");
    if (!action) return;
    alert("items deleted")
  }

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode === "SAVE10") {
      setAppliedCoupon({
        code: "SAVE10",
        discount: Math.floor(subtotal * 0.1),
      });
    } else if (couponCode === "FLAT500") {
      setAppliedCoupon({ code: "FLAT500", discount: 500 });
    } else {
      alert("Invalid coupon code");
    }
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
            <LuShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      {/* Header */}
      <div className="mb-6">
        {cartItems.length > 0 && (
          <div className="bg-primary rounded p-4 flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllSelection}
                className="w-5 h-5 text-btn2 border-gray-300 rounded focus:ring-2 focus:ring-btn2 cursor-pointer"
              />
              <span className="font-semibold text-text2">
                Select All Items ( {selectedItems.length}/{cartItems.length} )
              </span>
            </label>
            <button
              onClick={deleteAllItems}
              className="shrink-0 text-red-600  gap-2 cursor-pointer flex hover:text-red-700"
              aria-label="Remove item"
            >
              <LuTrash2 className="w-5 h-5" />
              <span className="font-semibold text-text2">
                Delete All Items
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`bg-primary rounded p-4 md:p-6 transition-all duration-300 ${!item.selected ? "opacity-60" : ""
                }`}
            >
              <div className="flex gap-3">
                {/* Checkbox */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="shrink-0 flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-5 h-5 text-btn2 border-gray-300 rounded focus:ring-2 focus:ring-btn2 cursor-pointer"
                    />
                  </div>

                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2 mb-2">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-sm md:text-base font-semibold text-text2 hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 text-red-600 hover:text-red-700 p-1"
                      aria-label="Remove item"
                    >
                      <LuTrash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="text-lg md:text-xl font-bold text-gray-900">
                      Rs.{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice > item.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          Rs.{item.originalPrice.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors duration-300"
                        aria-label="Decrease quantity"
                      >
                        <LuMinus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors duration-300"
                        aria-label="Increase quantity"
                      >
                        <LuPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-primary rounded p-4 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            {/* Coupon Code */}
            <div className="mb-4 p-2 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <LuTag className="w-5 h-5 text-btn2" />
                <span className="font-semibold text-text2">
                  Apply Coupon
                </span>
              </div>
              <div className="flex gap-2">
                <Input name="coupon" type="text" placeholder="Enter code" onChange={(e) =>
                  setCouponCode(e.target.value.toUpperCase())
                } value={couponCode} size="xl" />
                <Button bg="btn2" value="Apply" size="md" onClick={applyCoupon} style="base" />
              </div>
              {appliedCoupon && (
                <p className="text-xs text-btn1 mt-2">
                  ✓ Coupon "{appliedCoupon.code}" applied!
                </p>
              )}
            </div>

            {/* Price Details */}
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-text1">Subtotal</span>
                <span className="font-semibold text-text2">
                  Rs.{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text1">Delivery Charges</span>
                <span
                  className={`font-semibold ${deliveryCharge === 0 ? "text-green-600" : "text-text2"
                    }`}
                >
                  {deliveryCharge === 0 ? "FREE" : `Rs.${deliveryCharge}`}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-text1">Coupon Discount</span>
                  <span className="font-semibold text-green-600">
                    -Rs.{couponDiscount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Total Savings</span>
                <span className="font-semibold text-green-600">
                  Rs.{totalSavings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between mb-6 pb-4 border-b border-gray-200">
              <span className="text-lg font-bold text-text2">
                Total Amount
              </span>
              <span className="text-xl font-bold text-text2">
                Rs.{total.toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <Button
              value={`Proceed to Checkout ${selectedItems.length > 0 ? `(${selectedItems.length} items)` : ""}`}
              bg="btn2"
              size="md"
              style="base"
              link="/checkout"
              disabled={selectedItems.length === 0}
              classes="disabled:bg-gray-400 disabled:cursor-not-allowed w-full py-3"
              paddings={false}
            />

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
              <LuShieldCheck className="w-5 h-5 text-green-600" />
              <span>100% Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
