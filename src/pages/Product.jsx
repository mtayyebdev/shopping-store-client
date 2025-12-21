import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LuStar, LuShoppingCart, LuHeart } from "react-icons/lu";
import { Button, Heading, ProductCard } from "../components/index.js";

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch product details from API using slug
  const [product] = useState({
    id: 1,
    slug: slug,
    name: "Premium Wireless Headphones",
    brand: "AudioTech",
    shortDescription:
      "Experience superior sound quality with active noise cancellation and 30-hour battery life.",
    description:
      "Immerse yourself in premium audio with our flagship wireless headphones. Featuring industry-leading active noise cancellation technology, these headphones deliver crystal-clear sound across all frequencies. The 40mm drivers produce deep bass and crisp highs, while the advanced ANC blocks out ambient noise for an uninterrupted listening experience. With an impressive 30-hour battery life, premium memory foam ear cushions, and foldable design, these headphones are perfect for long journeys, daily commutes, or focused work sessions. The Bluetooth 5.0 ensures stable connectivity up to 10 meters, and the built-in microphone provides clear call quality.",
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.5,
    totalReviews: 328,
    inStock: true,
    stockQuantity: 45,
    returnDays: 7,
    warranty: "1 Year Warranty",
    deliveryCharge: "Free",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    ],
    colors: ["Black", "Gray", "Blue"],
    sizes: ["SM", "LG", "XL", "2XL"],
    specifications: {
      Brand: "AudioTech",
      Model: "AT-X500",
      Color: "Midnight Black",
      Connectivity: "Wireless Bluetooth 5.0",
      "Battery Life": "30 Hours",
      "Charging Time": "2 Hours",
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      Impedance: "32 Ohms",
      Weight: "250g",
      "Cable Length": "1.5m (Detachable)",
      Microphone: "Built-in with noise reduction",
      "Noise Cancellation": "Active ANC",
      Foldable: "Yes",
      "Package Contents":
        "Headphones, USB-C Cable, 3.5mm Cable, Carrying Case, User Manual",
    },
  });

  const [reviews] = useState([
    {
      id: 1,
      userName: "Rahul Sharma",
      rating: 5,
      verified: true,
      date: "15 Jan 2024",
      comment:
        "Excellent sound quality! The noise cancellation works perfectly. Highly recommended for music lovers.",
      helpful: 45,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&q=80",
      ],
    },
    {
      id: 2,
      userName: "Priya Patel",
      rating: 4,
      verified: true,
      date: "10 Jan 2024",
      comment:
        "Great product for the price. Battery life is impressive. Only minor issue is the weight during long sessions.",
      helpful: 32,
      images: [
        "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300&q=80",
      ],
    },
    {
      id: 3,
      userName: "Amit Kumar",
      rating: 5,
      verified: true,
      date: "5 Jan 2024",
      comment:
        "Best headphones I've ever owned. The bass is deep and clear. Worth every penny!",
      helpful: 28,
      images: [],
    },
  ]);

  const [relatedProducts] = useState([
    {
      id: 1,
      name: "Wireless Earbuds Pro",
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
      price: 1999,
      originalPrice: 3999,
      rating: 4.3,
      slug: "wireless-earbuds-pro",
    },
    {
      id: 2,
      name: "Wireless Earbuds Pro",
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
      price: 1999,
      originalPrice: 3999,
      rating: 4.3,
      slug: "wireless-earbuds-pro",
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
      price: 1499,
      originalPrice: 2499,
      rating: 4.6,
      slug: "bluetooth-speaker",
    },
    {
      id: 4,
      name: "Smart Watch",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
      price: 3499,
      originalPrice: 5999,
      rating: 4.4,
      slug: "smart-watch",
    },
    {
      id: 5,
      name: "Wireless Mouse",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
      price: 899,
      originalPrice: 1499,
      rating: 4.2,
      slug: "wireless-mouse",
    },
  ]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setquantity] = useState(1);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    images: [],
  });
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]);

  const handleAddToCart = () => {
    console.log("Added to cart");
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    navigate("/checkout");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      alert("Please provide rating and comment");
      return;
    }
    alert("Review submitted successfully!");
    setNewReview({ rating: 0, comment: "", images: [] });
    setReviewImagePreviews([]);
  };

  const handleReviewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + reviewImagePreviews.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setReviewImagePreviews([...reviewImagePreviews, ...newPreviews]);
    setNewReview({ ...newReview, images: [...newReview.images, ...files] });
  };

  const removeReviewImage = (index) => {
    const newPreviews = reviewImagePreviews.filter((_, i) => i !== index);
    const newImages = newReview.images.filter((_, i) => i !== index);
    setReviewImagePreviews(newPreviews);
    setNewReview({ ...newReview, images: newImages });
  };

  return (
    <div className="">
      {/* Main Product Section */}
      <div className="bg-primary p-5 my-5">
        <div className="flex flex-col md:flex-row">
          {/* Left - Images */}
          <div className="lg:w-1/2 w-full flex flex-col lg:flex-row gap-4">
            {/* Thumbnail Images */}
            <div className="flex flex-row lg:flex-col order-2 lg:order-1 gap-2 w-full lg:w-26 ">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`cursor-pointer border-2 overflow-hidden aspect-square ${selectedImage === index
                      ? "border-secondary2"
                      : "border-secondary"
                    }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full max-w-20 lg:max-w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="order-1 lg:order-2 w-full">
              <img
                alt="product"
                className="w-full h-auto object-cover object-center rounded"
                src={product.images[selectedImage]}
              />
            </div>
          </div>

          {/* Right - Details */}
          <div className="lg:w-1/2 w-full md:pl-5 mt-6 md:mt-0">
            <h2 className="text-sm text-text1 tracking-wider uppercase">
              {product.brand}
            </h2>
            <h1 className="text-text2 text-xl md:text-3xl font-medium">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center justify-between my-2">
              <div className="flex items-center">
                <span className="flex flex-col sm:flex-row gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <LuStar
                        key={index}
                        className={`w-4 h-4 ${index < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-text1 sm:ml-2">
                    Ratings {product.totalReviews}
                  </span>
                </span>
                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 gap-2">
                  {product.stockQuantity > 0 ? (
                    <p className="text-btn1 text-base">In Stock</p>
                  ) : (
                    <p className="text-red-600 text-base">Out Of Stock</p>
                  )}
                </span>
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="rounded-full bg-gray-200 p-2 border-0 inline-flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
              >
                <LuHeart
                  className={`w-5 h-5 ${isWishlisted ? "fill-red-600 text-red-600" : "text-gray-600"
                    }`}
                />
              </button>
            </div>

            {/* Price Section */}
            <div className="flex items-center flex-wrap gap-3 mb-6">
              <span className="title-font font-bold text-3xl text-secondary2">
                Rs.{product.price.toLocaleString()}
              </span>
              <span className="text-lg text-text1 line-through">
                Rs.{product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-btn1/10 text-btn1 px-3 py-1 rounded-full text-sm font-semibold">
                {product.discount}% OFF
              </span>
            </div>

            {/* Short Description */}
            <p className="leading-relaxed mb-4 text-text1">
              {product.shortDescription}
            </p>

            {/* Color & Size Selection */}
            <div className="flex flex-col gap-3 pt-5 border-t border-text2/50 mb-5">
              <div className="flex items-center">
                <span className="mr-3 font-semibold">Color: </span>
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`border-2 rounded-full w-6 h-6 focus:outline-none ml-1 ${selectedColor === index
                        ? "border-secondary2"
                        : "border-text1"
                      } ${color === "Black"
                        ? "bg-gray-900"
                        : color === "Gray"
                          ? "bg-gray-400"
                          : "bg-blue-500"
                      }`}
                  ></button>
                ))}
              </div>
              <div className="flex items-center">
                <span className="mr-3 font-semibold">Size: </span>
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(index)}
                    className={`border-2 rounded text-sm w-10 h-10 focus:outline-none ml-1 ${selectedSize === index
                        ? "bg-btn2 text-text border-secondary2"
                        : "border-text1"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product quantity update */}
            <div className="flex items-center gap-3 mb-6">
              <span className="mr-3 font-semibold">Quantity:</span>
              <div className="flex items-center border-2 border-text1 rounded overflow-hidden">
                <button className="px-4 py-2 hover:bg-btn2 hover:text-text transition-colors duration-300 font-semibold disabled:bg-gray-200 disabled:text-gray-500 text-text2 cursor-pointer" onClick={() => setquantity(quantity - 1)} disabled={quantity<=1}>
                  −
                </button>
                <span className="px-6 py-2 text-center font-semibold text-text2 border-l-2 border-r-2 border-text1 min-w-16">
                  {quantity}
                </span>
                <button className="px-4 py-2 hover:bg-btn2 disabled:bg-gray-200 disabled:text-gray-500 transition-colors duration-300 font-semibold text-text2 hover:text-text cursor-pointer" onClick={() => setquantity(quantity + 1)} disabled={quantity>=4}>
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row w-full sm:items-center gap-3 mb-6">
              <Button
                bg="btn1"
                value="Buy Now"
                size="md"
                style="base"
                classes="w-full font-semibold"
                onClick={handleBuyNow}
              />
              <Button
                bg="btn2"
                value="Add to Cart"
                icon={<LuShoppingCart className="w-5 h-5" />}
                iconPosition="left"
                size="md"
                style="base"
                classes="w-full font-semibold"
                onClick={handleAddToCart}
              />
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-text2/50 border-t pt-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Stock:</span>
                <span
                  className={
                    product.inStock
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {product.inStock
                    ? `${product.stockQuantity} Available`
                    : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Delivery:</span>
                <span className="text-gray-900 font-semibold">
                  {product.deliveryCharge}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Return:</span>
                <span className="text-gray-900 font-semibold">
                  {product.returnDays} Days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Warranty:</span>
                <span className="text-gray-900 font-semibold">
                  {product.warranty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-primary p-5 my-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Description
        </h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Specifications */}
      <div className="bg-primary p-5 my-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex border-b border-gray-200 py-2">
              <span className="font-semibold text-gray-700 w-1/2">{key}</span>
              <span className="text-gray-900 w-1/2">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-primary p-5 my-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text2">
          Customer Reviews ({reviews.length})
        </h2>
      </div>
      <div className="bg-primary p-5 my-5">
        {/* Add Review Form */}
        <h3 className="font-bold text-text2 mb-4">Write a Review</h3>
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
                    className={`w-8 h-8 ${star <= newReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
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
              rows="4"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300"
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
          <Button
            value="Submit Review"
            bg="btn2"
            size="md"
            style="base"
            onClick={handleSubmitReview}
          />
        </div>
      </div>

      <div className="bg-primary p-5 my-5">
        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">
                      {review.userName}
                    </span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, index) => (
                        <LuStar
                          key={index}
                          className={`w-4 h-4 ${index < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity duration-300"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-primary p-5 my-5">
        <Heading title={"Related Item"} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
