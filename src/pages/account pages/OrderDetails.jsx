import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { LuArrowLeft, LuTruck, LuCircleCheck, LuClock, LuMapPin, LuPhone, LuUser, LuCreditCard, LuRotateCcw, LuStar } from "react-icons/lu";
import { useOutletContext } from 'react-router-dom'
import { getOrderData, cancelOrder, getOrders } from '../../store/publicSlices/OrderSlice'
import { toast } from 'react-toastify'
import axios from 'axios';
import { Button } from '../../components/index'

function OrderDetails() {
  const { setIsSidebarOpen } = useOutletContext();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderData, setorderData] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    images: []
  })
  const [reviewProductId, setreviewProductId] = useState(null)
  const [reviewImagePreviews, setReviewImagePreviews] = useState([])
  const [orderItemData, setorderItemData] = useState(null);


  useEffect(() => {
    if (orderId) {
      async function fetchOrder() {
        await dispatch(getOrderData(orderId))
          .then((res) => {
            if (res.payload?.success) {
              setorderData(res.payload?.data);
            }
          })
      }
      fetchOrder()
    }
  }, [orderId, dispatch])

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setIsCancelling(true)
      const result = await dispatch(cancelOrder(orderId))
      setIsCancelling(false)
      if (result.payload?.success) {
        toast.success('Order cancelled successfully');
        dispatch(getOrders())
        setTimeout(() => navigate(-1), 1500)
      }
    }
  }

  const handleReturn = () => {
    setShowReturnModal(true)
  }

  const handleReview = () => {
    setShowReviewModal(true)
  }

  const submitReturn = () => {
    toast.success('Return request submitted successfully')
    setShowReturnModal(false)
  }

  const orderItemDataHandler = (id) => {
    const itemdata = orderData?.items?.find((item) => item._id === id);
    setorderItemData(itemdata)
  }

  const handleSubmitReview = async (e) => {
    e?.preventDefault()
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      toast.error('Please provide rating and comment')
      return;
    }
    if (!reviewProductId) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("message", newReview.comment.trim());
      formData.append("rating", newReview.rating);
      formData.append("orderId", orderId);
      newReview.images.forEach((i) => {
        formData.append("images", i)
      })

      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/product/create-review/${reviewProductId}`, formData, { withCredentials: true });
      if (res.status == 200) {
        toast.success('Review submitted successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong!")
    }

    setNewReview({ rating: 0, comment: "", images: [] })
    setReviewImagePreviews([])
    setShowReviewModal(false)
  }

  const handleReviewImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + reviewImagePreviews.length > 4) {
      toast.error('You can upload maximum 4 images')
      return
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setReviewImagePreviews([...reviewImagePreviews, ...newPreviews])
    setNewReview({ ...newReview, images: [...newReview.images, ...files] })
  }

  const removeReviewImage = (index) => {
    const newPreviews = reviewImagePreviews.filter((_, i) => i !== index)
    const newImages = newReview.images.filter((_, i) => i !== index)
    setReviewImagePreviews(newPreviews)
    setNewReview({ ...newReview, images: newImages })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "shipped":
        return "bg-blue-100 text-blue-700"
      case "processing":
        return "bg-orange-100 text-orange-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: "To Pay",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled"
    }
    return labels[status] || status
  }

  const getPaymentFullForm = (paymentMethod) => {
    const methods = {
      cod: "Cash On Delivery",
      easypaisa: "EasyPaisa",
      jazzcash: "Jazz Cash",
      paypal: "PayPal",
      stripe: "Stripe"
    };
    return methods[paymentMethod] || paymentMethod;
  }

  const orderTimeline = [
    { step: "Order Placed", status: "pending", icon: LuClock },
    { step: "Processing", status: "processing", icon: LuClock },
    { step: "Shipped", status: "shipped", icon: LuTruck },
    { step: "Delivered", status: "delivered", icon: LuCircleCheck }
  ]

  if (!orderData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-text1 text-lg mb-4">Order not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-btn2 text-white rounded-lg hover:bg-opacity-90"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <LuArrowLeft
          size={24}
          onClick={() => setIsSidebarOpen(true)}
          className='cursor-pointer hover:text-btn2 transition-colors lg:hidden'
        />
        <h2 className="text-2xl font-bold text-text2">Order Details</h2>
      </div>

      {/* Order Header Card */}
      <div className="bg-primary rounded-lg p-3 md:p-6 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-text1 mb-1">Order ID</p>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-text2">{orderData.orderId}</p>
          </div>
          <div>
            <p className="text-sm text-text1 mb-1">Order Date</p>
            <p className="text-lg font-semibold text-text2">
              {new Date(orderData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text1 mb-1">Status</p>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(orderData.orderStatus)}`}>
              {getStatusLabel(orderData.orderStatus)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-primary rounded-lg p-4 md:p-6 mb-6 border border-gray-200">
        <h3 className="text-lg font-bold text-text2 mb-6">Order Timeline</h3>
        <div className="flex items-center justify-between overflow-x-auto pb-4">
          {orderTimeline.map((item, index) => {
            const isCompleted = orderTimeline.findIndex(t => t.status === orderData.orderStatus) >= index
            const IconComponent = item.icon

            return (
              <div key={index} className="flex items-center shrink-0">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                    <IconComponent size={20} />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-center text-text2 whitespace-nowrap px-2">
                    {item.step}
                  </p>
                </div>
                {index < orderTimeline.length - 1 && (
                  <div className={`h-1 w-8 md:w-12 mx-2 ${isCompleted ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Section */}
          <div className="bg-primary rounded-lg p-4 md:p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-text2 mb-4">Order Items</h3>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-2">
                  {/* Product Image */}
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                    />

                    <div className="flex flex-col md:flex-row md:gap-4">
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text2 text-sm md:text-base line-clamp-2">
                          {item.name}
                        </p>
                        <div className="text-xs md:text-sm text-text1 space-y-1 mt-2">
                          {item.color && (
                            <p>Color: <span className="font-medium text-text2">{item.color}</span></p>
                          )}
                          {item.size && (
                            <p>Size: <span className="font-medium text-text2">{item.size}</span></p>
                          )}
                          <p>Quantity: <span className="font-medium text-text2">{item.quantity}</span></p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg md:text-xl font-bold text-text2">
                          Rs. {item.price}
                        </p>
                        <p className="text-xs md:text-sm text-text1 mt-2">
                          Subtotal: Rs. {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                  {
                    orderData.orderStatus === "delivered" ? item.isReviewed ? <div className='flex items-center flex-row justify-end text-amber-400 font-semibold'>
                      <LuCircleCheck size={20} />
                      <p className='ms-1'>Already Reviewed</p>
                    </div> : <div className='flex mt-2 flex-row justify-end'>
                      <Button
                        onClick={() => { handleReview(); setreviewProductId(item.product) }}
                        bg='btn2'
                        icon={<LuStar size={18} />}
                        size='sm'
                        style='base'
                        value='Write a Review'
                      />
                    </div> : ""
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-primary rounded-lg p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <LuMapPin className="text-btn2" size={20} />
              <h3 className="text-lg font-bold text-text2">Shipping Address</h3>
            </div>
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex items-start gap-2">
                <LuUser className="text-gray-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-text1 text-xs">Name</p>
                  <p className="font-medium text-text2">{orderData.shippingAddress.username}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <LuPhone className="text-gray-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-text1 text-xs">Phone</p>
                  <p className="font-medium text-text2">{orderData.shippingAddress.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <LuMapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-text1 text-xs">Address</p>
                  <p className="font-medium text-text2">{orderData.shippingAddress.address}</p>
                  {orderData.shippingAddress.landmark && (
                    <p className="text-text1 text-xs mt-1">Landmark: {orderData.shippingAddress.landmark}</p>
                  )}
                </div>
              </div>
              <div className="pt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-text1 text-xs">City</p>
                  <p className="font-medium text-text2">{orderData.shippingAddress.city}</p>
                </div>
                <div>
                  <p className="text-text1 text-xs">Region</p>
                  <p className="font-medium text-text2">{orderData.shippingAddress.region}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-text1 text-xs">District</p>
                  <p className="font-medium text-text2">{orderData.shippingAddress.district}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-primary rounded-lg p-4 md:p-6 border border-gray-200 sticky top-4">
            <h3 className="text-lg font-bold text-text2 mb-4">Order Summary</h3>
            <div className="space-y-3 pb-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-text1">Items Price</span>
                <span className="font-semibold text-text2">Rs. {orderData.itemsPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text1">Shipping</span>
                <span className="font-semibold text-text2">Rs. {orderData.shippingPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text1">Tax</span>
                <span className="font-semibold text-text2">Rs. {orderData.taxPrice}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 pb-6">
              <span className="text-lg font-bold text-text2">Total</span>
              <span className="text-2xl font-bold text-btn2">Rs. {orderData.totalPrice}</span>
            </div>

            {/* Payment & Delivery Info */}
            <div className="space-y-3 pb-6 border-b border-gray-200">
              {orderData.paymentMethod && (
                <div>
                  <p className="text-xs text-text1 mb-1">Payment Method</p>
                  <p className="font-semibold text-text2 capitalize">{getPaymentFullForm(orderData.paymentMethod)}</p>
                </div>
              )}
              {orderData.paymentStatus && (
                <div>
                  <p className="text-xs text-text1 mb-1">Payment Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${orderData.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}
                  </span>
                </div>
              )}
              {orderData.deliveredAt && (
                <div>
                  <p className="text-xs text-text1 mb-1">Delivered On</p>
                  <p className="font-semibold text-text2">
                    {new Date(orderData.deliveredAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* PENDING STATUS - Cancel & Payment */}
              {orderData.orderStatus === 'pending' && (
                <>
                  <button
                    onClick={() => navigate(`/payment/${orderData._id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-btn2 hover:bg-opacity-90 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
                  >
                    <LuCreditCard size={18} />
                    Add Payment Method
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </>
              )}

              {/* DELIVERED STATUS - Return & Review */}
              {orderData.orderStatus === 'delivered' && (
                <>
                  <button
                    onClick={handleReturn}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
                  >
                    <LuRotateCcw size={18} />
                    Return Item
                  </button>
                </>
              )}

              {/* CANCELLED/REFUNDED STATUS - Message Only */}
              {(orderData.orderStatus === 'cancelled' || orderData.orderStatus === 'refunded') && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
                  This order has been {orderData.orderStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary rounded-lg p-6 max-w-md w-full border border-gray-200">
            <h3 className="text-xl font-bold text-text2 mb-4">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <LuStar
                        className={`w-8 h-8 ${star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 resize-none"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add Images (Optional - Max 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleReviewImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {reviewImagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {reviewImagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeReviewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-text2 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 px-4 py-2 bg-btn2 text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary rounded-lg p-6 max-w-md w-full border border-gray-200">
            <h3 className="text-xl font-bold text-text2 mb-4">Request a Return</h3>
            <div className="mb-4">
              <label htmlFor='items' className="block text-sm font-medium text-text2 mb-2">
                Select One Item to Return
              </label>
              <div>
                {
                  orderData?.items?.map((item) => (
                    <div className="flex cursor-pointer hover:bg-gray-200 rounded-md p-1" key={item._id} onClick={() => orderItemDataHandler(item._id)}>
                      <input type="radio" name="item" id={item._id} />
                      <label htmlFor={item._id} className='flex ms-2'>
                        <img src={item.image} className='w-12 h-10 rounded me-2' alt={item.name} />
                        <p className='text-sm line-clamp-2'>{item.name}</p>
                      </label>
                    </div>
                  ))
                }
              </div>
              {
                orderItemData && <div className='flex'>
                  <select id="quantity">
                    {
                      Array.from({ length: orderItemData.quantity }).map((_, i) => (
                        <option value={i + 1} key={i}>{i + 1}</option>
                      ))
                    }
                  </select>
                </div>
              }
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text2 mb-2" htmlFor='reason'>
                Reason for Return
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:border-btn2 focus:ring-2 focus:ring-btn2 focus:ring-opacity-20 outline-none" id='reason'>
                <option>Defective Product</option>
                <option>Not as Described</option>
                <option>Wrong Size</option>
                <option>Wrong Color</option>
                <option>Changed Mind</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text2 mb-2">
                Additional Comments
              </label>
              <textarea
                placeholder="Provide more details about your return..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-btn2 focus:ring-2 focus:ring-btn2 focus:ring-opacity-20 outline-none resize-none"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-text2 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReturn}
                className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
