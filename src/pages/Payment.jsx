import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  LuCreditCard, 
  LuBanknote, 
  LuWallet, 
  LuShieldCheck,
  LuPackage
} from "react-icons/lu";
import {Button,Input} from '../components/index.js'

export default function Payment() {
  const { orderid } = useParams();
  const navigate = useNavigate();

  // Fetch order details from DB using orderId - Replace with actual API call
  const [orderDetails] = useState({
    id: orderid,
    items: [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        quantity: 1,
        price: 2999
      },
      {
        id: 2,
        name: "Smart Watch Pro Series",
        quantity: 2,
        price: 5499
      }
    ],
    subtotal: 13997,
    deliveryCharge: 0,
    total: 13997,
    shippingAddress: {
      fullName: "John Doe",
      phone: "+91 9876543210",
      address: "123 Main Street, Apartment 4B, Mumbai, Maharashtra - 400001"
    }
  });

  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment method specific states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountName: ""
  });

  const [upiId, setUpiId] = useState("");

  // Payment methods
  const paymentMethods = [
    {
      id: "card",
      name: "Credit / Debit Card",
      icon: LuCreditCard,
      description: "Visa, Mastercard, Rupay"
    },
    {
      id: "bank",
      name: "Net Banking",
      icon: LuBanknote,
      description: "All major banks"
    },
    {
      id: "upi",
      name: "UPI / PayPal",
      icon: LuWallet,
      description: "GPay, PhonePe, PayPal"
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: LuPackage,
      description: "Pay when you receive"
    }
  ];

  // Handle card input
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      setCardDetails({ ...cardDetails, [name]: formatted });
    } else if (name === "expiryDate") {
      const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2").substr(0, 5);
      setCardDetails({ ...cardDetails, [name]: formatted });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  // Handle bank input
  const handleBankChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  // Process payment
  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate based on selected method
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }

    if (selectedMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        alert("Please fill in all card details");
        return;
      }
    } else if (selectedMethod === "bank") {
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountName) {
        alert("Please fill in all bank details");
        return;
      }
    } else if (selectedMethod === "upi") {
      if (!upiId) {
        alert("Please enter UPI ID or PayPal email");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Send payment data to backend
      const paymentData = {
        orderId: orderid,
        method: selectedMethod,
        amount: orderDetails.total,
        ...(selectedMethod === "card" && { cardDetails }),
        ...(selectedMethod === "bank" && { bankDetails }),
        ...(selectedMethod === "upi" && { upiId })
      };

      console.log("Processing payment:", paymentData);

      // Redirect to success page
      navigate(`/order-success/${orderid}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text2">
            Payment
          </h1>
          <p className="text-sm text-text1 mt-1">
            Order ID: #{orderid}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Payment Methods & Forms */}
          <div className="lg:col-span-2 space-y-4">
            {/* Payment Methods Selection */}
            <div className="bg-primary p-4 rounded">
              <h2 className="text-lg font-bold text-text2 mb-4">
                Select Payment Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                        selectedMethod === method.id
                          ? "border-btn2 bg-btn2/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedMethod === method.id ? "bg-btn2" : "bg-gray-100"
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            selectedMethod === method.id ? "text-white" : "text-text1"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-text2 text-sm md:text-base">
                            {method.name}
                          </h3>
                          <p className="text-xs text-text1">
                            {method.description}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === method.id
                            ? "border-btn2 bg-btn2"
                            : "border-gray-300"
                        }`}>
                          {selectedMethod === method.id && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Forms Based on Selected Method */}
            {selectedMethod === "card" && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-lg font-bold text-text2 mb-4">
                  Card Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={cardDetails.cardName}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        maxLength="3"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "bank" && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-lg font-bold text-text2 mb-4">
                  Net Banking Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={handleBankChange}
                      placeholder="Enter account number"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={bankDetails.ifscCode}
                      onChange={handleBankChange}
                      placeholder="Enter IFSC code"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={bankDetails.accountName}
                      onChange={handleBankChange}
                      placeholder="Enter account holder name"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "upi" && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-lg font-bold text-text2 mb-4">
                  UPI / PayPal Details
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    UPI ID or PayPal Email *
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi or email@paypal.com"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your UPI ID (e.g., 9876543210@paytm) or PayPal email
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === "cod" && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-lg font-bold text-text2 mb-3">
                  Cash on Delivery
                </h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Note:</span> Please keep exact change ready. 
                    You can pay in cash when your order is delivered.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-primary rounded p-4 sticky top-4">
              <h2 className="text-xl font-bold text-text2 mb-4">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-text2">
                      Rs.{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-bold text-text2 mb-2">
                  Shipping Address
                </h3>
                <p className="text-xs text-gray-700">
                  <span className="font-medium">{orderDetails.shippingAddress.fullName}</span>
                  <br />
                  {orderDetails.shippingAddress.phone}
                  <br />
                  {orderDetails.shippingAddress.address}
                </p>
              </div>

              {/* Price Details */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-text1">Subtotal</span>
                  <span className="font-semibold text-text2">
                    Rs.{orderDetails.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text1">Delivery Charges</span>
                  <span className={`font-semibold ${orderDetails.deliveryCharge === 0 ? 'text-green-600' : 'text-text2'}`}>
                    {orderDetails.deliveryCharge === 0 ? 'FREE' : `Rs.${orderDetails.deliveryCharge}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-text2">Total Amount</span>
                <span className="text-xl font-bold text-text2">
                  Rs.{orderDetails.total.toLocaleString()}
                </span>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={!selectedMethod || isProcessing}
                className="w-full bg-btn2 text-white py-3 rounded-lg font-bold hover:bg-hover-btn2 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay Rs.${orderDetails.total.toLocaleString()}`
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-text1">
                <LuShieldCheck className="w-5 h-5 text-green-600" />
                <span>100% Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}