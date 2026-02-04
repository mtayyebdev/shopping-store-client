import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuMapPin, LuPackage } from "react-icons/lu";
import { Button, Input } from '../components/index.js'
import { useSelector,useDispatch } from "react-redux";
import { getOrders } from "../store/publicSlices/OrderSlice.jsx";
import axios from "axios";
import { toast } from "react-toastify";

export default function Checkout() {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.userSlice);
  const { orderData } = useSelector((state) => state.orderSlice);

  // Default address from DB
  const [defaultAddress, setdefaultAddress] = useState(null);

  // Selected items from cart
  const selectedItems = orderData?.selectedItems || [];

  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    district: "",
    landmark: "",
    shipTo: "",
    email: ""
  });

  // Load default address when checkbox is checked
  useEffect(() => {
    if (useDefaultAddress && defaultAddress) {
      setShippingAddress(defaultAddress);
    } else if (!useDefaultAddress) {
      setShippingAddress({
        name: "",
        phone: "",
        address: "",
        city: "",
        region: "",
        district: "",
        landmark: "",
        shipTo: "",
        email: ""
      });
    }
  }, [useDefaultAddress, defaultAddress]);

  useEffect(() => {
    if (isLoggedIn) {
      if (user && user.addresses) {
        const defaultAddress = user?.addresses?.find((addr) => addr.defaultShipping === true);
        setdefaultAddress(defaultAddress || null);
      }
    }
  }, [user, isLoggedIn]);

  // Handle input change
  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    // Validate form
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address ||
      !shippingAddress.city || !shippingAddress.region || !shippingAddress.district) {
      toast.error("Please fill in all shipping address fields");
      return;
    }
    if (orderData?.directOrder) {
      if (!shippingAddress.email) {
        toast.error("Email is required");
        return;
      }
    }

    if (orderData?.directOrder) {
      const bodyData = {
        productId: orderData?.productId,
        quantity: orderData?.quantity,
        size: orderData?.size,
        color: orderData?.color,
        totalPrice: orderData?.total,
        taxPrice: 0,
        shippingAddress,
      }

      try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/buy-now`, bodyData);
        if (res.status === 200) {
          navigate(`/payment/${res.data.data}`);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      }
      
    } else {
      const cartsIds = selectedItems.map((item) => item._id);
      const orderPayload = {
        cartsIds,
        shippingAddress,
        itemsPrice: orderData?.subtotal,
        shippingPrice: orderData?.deliveryCharge,
        taxPrice: 0,
        totalPrice: orderData?.total
      }

      try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/create`, orderPayload, {
          withCredentials: true,
        });
        if (res.status === 200) {
          navigate(`/payment/${res.data.data}`);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
    dispatch(getOrders())
  };

  return (
    <div className="min-h-screen py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-text2">
          Checkout
        </h1>
        <p className="text-sm text-text1 mt-1">
          Complete your order by providing delivery details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Shipping Address Form */}
        <div className="lg:col-span-2">
          <div className="bg-primary rounded p-4">
            <div className="flex items-center gap-2 mb-6">
              <LuMapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-bold text-text2">
                Shipping Address
              </h2>
            </div>

            {/* Use Default Address Checkbox */}
            {isLoggedIn ? defaultAddress && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDefaultAddress}
                    onChange={(e) => setUseDefaultAddress(e.target.checked)}
                    className="w-5 h-5 text-btn2 border-gray-300 rounded focus:ring-2 focus:ring-btn2 cursor-pointer mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-text2 block mb-2">
                      Use my default address
                    </span>
                    <div className="text-sm text-text1">
                      <p className="font-medium">{defaultAddress?.name} | {defaultAddress?.phone}</p>
                      <p className="mt-1">
                        {defaultAddress?.address}, {defaultAddress?.city}, {defaultAddress?.region} - {defaultAddress?.district}
                      </p>
                      <p className="mt-1">{defaultAddress?.landmark}</p>
                      <div className="mt-1">Ship To: {defaultAddress?.shipTo?.toUpperCase()}</div>
                    </div>
                  </div>
                </label>
              </div>
            ) : ""}

            {/* Shipping Address Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  labelText="Full Name *"
                  label={true}
                  placeholder="Enter full name"
                  name="name"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  required
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  disabled={useDefaultAddress}
                />
                <Input
                  type="tel"
                  labelText="Phone Number *"
                  label={true}
                  placeholder="+92 3358217210"
                  name="phone"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  required
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  disabled={useDefaultAddress}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text2 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  placeholder="House No, Building Name, Street"
                  rows="3"
                  disabled={useDefaultAddress}
                  className="w-full px-4 py-2.5 border-1 border-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  labelText="City *"
                  label={true}
                  placeholder="City"
                  name="city"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  required
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  disabled={useDefaultAddress}
                />
                <Input
                  type="text"
                  labelText="Region *"
                  label={true}
                  placeholder="State/Province"
                  name="region"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  required
                  value={shippingAddress.region}
                  onChange={handleInputChange}
                  disabled={useDefaultAddress}
                />

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  labelText="District *"
                  label={true}
                  placeholder="District"
                  name="district"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  required
                  value={shippingAddress.district}
                  onChange={handleInputChange}
                  disabled={useDefaultAddress}
                />
                <Input
                  type="text"
                  labelText="Landmark *"
                  label={true}
                  placeholder="Nearby Landmark"
                  name="landmark"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  value={shippingAddress.landmark}
                  onChange={handleInputChange}
                  disabled={useDefaultAddress}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shipTo" className="font-semibold text-sm">Ship To</label>
                  <select
                    id="shipTo"
                    name="shipTo"
                    value={shippingAddress.shipTo || ""}
                    onChange={handleInputChange}
                    disabled={useDefaultAddress}
                    className="w-full px-4 py-2.5 border-1 border-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                {orderData.directOrder && <Input
                  type="email"
                  labelText="Email *"
                  label={true}
                  placeholder="Your Email"
                  name="email"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                />}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-primary rounded p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <LuPackage className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-text2">
                Order Summary
              </h2>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              {orderData?.directOrder ? selectedItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text2 line-clamp-2 mb-1">
                      {item?.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text1">
                        Qty: {item?.quantity}
                      </span>
                      <span className="text-sm font-bold text-text2">
                        Rs.{(item?.price * item?.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )) : selectedItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item?.item?.image}
                      alt={item?.item?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text2 line-clamp-2 mb-1">
                      {item?.item?.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text1">
                        Qty: {item?.item?.quantity}
                      </span>
                      <span className="text-sm font-bold text-text2">
                        Rs.{(item?.item?.price * item?.item?.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-text1">Subtotal ({selectedItems?.length} items)</span>
                <span className="font-semibold text-text2">Rs.{orderData?.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text1">Delivery Charges</span>
                <span className={`font-semibold ${orderData?.deliveryCharge === 0 ? 'text-green-600' : 'text-text2'}`}>
                  {orderData?.deliveryCharge === 0 ? 'FREE' : `Rs.${orderData?.deliveryCharge}`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold text-text2">Total Amount</span>
              <span className="text-xl font-bold text-text2">Rs.{orderData?.total?.toLocaleString()}</span>
            </div>

            {/* Proceed to Payment Button */}
            <Button value="Proceed to Payment" bg="btn2" size="md" style="base" onClick={handleProceedToPayment} classes="w-full" />

            {/* Back to Cart Link */}
            <Link
              to="/cart"
              className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}