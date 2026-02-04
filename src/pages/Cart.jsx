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
import { getCarts, deleteCart, deleteCarts, updateCart, toggleCartSelection } from '../store/publicSlices/CartSlice.jsx'
import { useCoupon } from '../store/publicSlices/CouponSlice.jsx'
import { setCheckoutData } from '../store/publicSlices/OrderSlice.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from "react";

export default function Cart() {
  const disptach = useDispatch();
  const { carts } = useSelector((state) => state.cartSlice);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartsChanged, setcartsChanged] = useState(false);

  // Get selected items
  const selectedItems = carts?.filter((item) => item.selected);
  const allSelected =
    carts?.length > 0 && carts.every((item) => item.selected);

  // Calculate totals (only for selected items)
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item?.totalPrice,
    0
  );
  const totalSavings = selectedItems.reduce(
    (sum, item) => sum + (item?.item.oldPrice - item?.item.price) * item?.item.quantity,
    0
  );
  const deliveryCharge = selectedItems.reduce((sum, item) => sum + (item?.item.shippingFee || 0), 0);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      couponDiscount = (subtotal * appliedCoupon.discount) / 100;
    } else {
      couponDiscount = appliedCoupon.discount;
    }
  }
  let total = subtotal + deliveryCharge - couponDiscount;

  // Toggle item selection
  const toggleItemSelection = (id) => {
    disptach(toggleCartSelection({ cartId: id, selected: !carts.find(item => item._id === id).selected }));
    setcartsChanged(!cartsChanged);
  };

  // Toggle all items selection
  const toggleAllSelection = () => {
    const newSelectedState = !allSelected;
    carts.forEach((item) => {
      disptach(toggleCartSelection({ cartId: item._id, selected: newSelectedState }));
    });
    setcartsChanged(!cartsChanged);
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    disptach(updateCart({ cartId: id, quantity: newQuantity }));
    setcartsChanged(!cartsChanged);
  };

  // Remove item
  const removeItem = (id) => {
    disptach(deleteCart(id));
    setcartsChanged(!cartsChanged);
  };

  // Delete all items
  const deleteAllItems = () => {
    const action = confirm("Do you want to delete all your items in cart?");
    if (!action) return;
    const ids = carts.map((item) => item._id);
    disptach(deleteCarts({ cartsIds: ids }));
    setcartsChanged(!cartsChanged);
  }

  // Apply coupon
  const applyCoupon = () => {
    if (!couponCode) return;
    disptach(useCoupon({ code: couponCode, totalAmount: Number(subtotal) }))
      .then((res) => {
        if (res.type === "usecoupon/fulfilled") {
          setAppliedCoupon({
            code: couponCode,
            discount: res.payload.data.discountValue,
            discountType: res.payload.data.discountType
          });
        }
      })
  };

  useEffect(() => {
    disptach(getCarts());
  }, [cartsChanged])

  const saveDataForCheckout = () => {
    const checkoutData = {
      selectedItems: selectedItems,
      subtotal: subtotal,
      deliveryCharge: deliveryCharge,
      coupon: appliedCoupon,
      couponDiscount: couponDiscount,
      total: total
    };

    disptach(setCheckoutData(checkoutData));
  }

  // Empty cart view
  if (carts?.length === 0) {
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
        {carts?.length > 0 && (
          <div className="bg-primary rounded p-4 flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllSelection}
                className="w-5 h-5 text-btn2 border-gray-300 rounded focus:ring-2 focus:ring-btn2 cursor-pointer"
              />
              <span className="font-semibold text-text2">
                Select All Items ( {selectedItems.length}/{carts?.length} )
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
          {carts?.map((item) => (
            <div
              key={item._id}
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
                      onChange={() => toggleItemSelection(item._id)}
                      className="w-5 h-5 text-btn2 border-gray-300 rounded focus:ring-2 focus:ring-btn2 cursor-pointer"
                    />
                  </div>

                  {/* Product Image */}
                  <Link to={`/product/${item?.item.slug}`} className="shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item?.item.image}
                        alt={item?.item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2 mb-2">
                    <Link to={`/product/${item?.item.slug}`}>
                      <h3 className="text-sm md:text-base font-semibold text-text2 hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {item?.item.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="shrink-0 text-red-600 hover:text-red-700 p-1"
                      aria-label="Remove item"
                    >
                      <LuTrash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="text-lg md:text-xl font-bold text-gray-900">
                      Rs.{item?.item.price.toLocaleString()}
                    </span>
                    {item?.item.oldPrice > item?.item.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          Rs.{item?.item.oldPrice.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item?.item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors duration-300"
                        aria-label="Decrease quantity"
                      >
                        <LuMinus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                        {item?.item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item?.item.quantity + 1)
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
              onClick={saveDataForCheckout}
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
