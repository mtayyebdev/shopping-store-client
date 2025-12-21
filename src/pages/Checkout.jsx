import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuMapPin, LuPackage } from "react-icons/lu";
import { Button, Input } from '../components/index.js'

export default function Checkout() {
  const navigate = useNavigate();

  // Default address from DB - Replace with actual API call
  const [defaultAddress] = useState({
    fullName: "John Doe",
    phone: "+91 9876543210",
    address: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  });

  // Sample selected cart items - Replace with actual cart state
  const [selectedItems] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      price: 2999,
      quantity: 1
    },
    {
      id: 2,
      name: "Smart Watch Pro Series",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
      price: 5499,
      quantity: 2
    }
  ]);

  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Load default address when checkbox is checked
  useEffect(() => {
    if (useDefaultAddress && defaultAddress) {
      setShippingAddress(defaultAddress);
    } else if (!useDefaultAddress) {
      setShippingAddress({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
      });
    }
  }, [useDefaultAddress, defaultAddress]);

  // Calculate totals
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  // Handle input change
  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  // Proceed to payment
  const handleProceedToPayment = (e) => {
    e.preventDefault();

    // Validate form
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address ||
      !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      alert("Please fill in all shipping address fields");
      return;
    }

    // Navigate to payment page with order details
    navigate('/payment/34737247384', {
      state: {
        shippingAddress: shippingAddress,
        items: selectedItems,
        total: total
      }
    });
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
            {defaultAddress && (
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
                      <p className="font-medium">{defaultAddress.fullName} | {defaultAddress.phone}</p>
                      <p className="mt-1">
                        {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Shipping Address Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  labelText="Full Name *"
                  label={true}
                  placeholder="Enter full name"
                  name="fullName"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  required
                  value={shippingAddress.fullName}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  labelText="State *"
                  label={true}
                  placeholder="State"
                  name="state"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  required
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  disabled={useDefaultAddress}
                />
                <Input
                  type="text"
                  labelText="Pincode *"
                  label={true}
                  placeholder="400001"
                  name="pincode"
                  size="xl"
                  classes={"disabled:bg-gray-100 disabled:cursor-not-allowed w-full"}
                  required
                  value={shippingAddress.pincode}
                  onChange={handleInputChange}
                  disabled={useDefaultAddress}
                />
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
              {selectedItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text2 line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text1">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-text2">
                        Rs.{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-text1">Subtotal ({selectedItems.length} items)</span>
                <span className="font-semibold text-text2">Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text1">Delivery Charges</span>
                <span className={`font-semibold ${deliveryCharge === 0 ? 'text-green-600' : 'text-text2'}`}>
                  {deliveryCharge === 0 ? 'FREE' : `Rs.${deliveryCharge}`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold text-text2">Total Amount</span>
              <span className="text-xl font-bold text-text2">Rs.{total.toLocaleString()}</span>
            </div>

            {/* Proceed to Payment Button */}
            <Button value="Proceed to Payment" bg="btn2" size="md" style="base" onClick={handleProceedToPayment} classes="w-full"/>

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