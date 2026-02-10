import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LuStar, LuShoppingCart, LuHeart } from "react-icons/lu";
import { Button, Heading, ProductCard } from "../components/index.js";
import { useDispatch, useSelector } from 'react-redux'
import { getSingleProduct, getRelated } from '../store/publicSlices/ProductsSlice.jsx'
import { addToCart, getCarts } from '../store/publicSlices/CartSlice.jsx'
import { setCheckoutData } from '../store/publicSlices/OrderSlice.jsx'
import { toast } from "react-toastify";

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { relatedProducts } = useSelector((state) => state.productsSlice);
  const [product, setproduct] = useState(null);
  const [reviews, setreviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setquantity] = useState(1);

  const handleAddToCart = async () => {
    const body = {
      quantity, color: product.color[selectedColor] || "", size: product.size[selectedSize] || ""
    }
    await dispatch(addToCart({
      productId: product?._id,
      body: body
    }))
      .then((res) => {
        if (res.type === "addtocart/fulfilled") {
          dispatch(getCarts());
        } else {
          toast.error("Failed to add product to cart. Please try again.");
        }
      });
  };

  const handleBuyNow = () => {
    const orderData = {
      directOrder: true,
      quantity,
      color: product.color[selectedColor] || "",
      size: product.size[selectedSize] || "",
      total: (product?.price * quantity) + product?.shippingPrice,
      productId: product?._id,
      deliveryCharge: product?.shippingPrice,
      subtotal: product?.price * quantity,
      selectedItems: [
        {
          _id: product?._id,
          name: product?.name,
          price: product?.price,
          quantity,
          image: product?.image.url
        }
      ]
    }
    dispatch(setCheckoutData(orderData));
    navigate("/checkout");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      await dispatch(getSingleProduct(slug))
        .then((res) => {
          if (res.type === "getproduct/fulfilled") {
            setproduct(res.payload?.data?.product);
            setreviews(res.payload?.data?.reviews);
            // fetch related products
            dispatch(getRelated(res.payload?.data?.product?._id))
          }
        })
    };
    fetchProduct();
  }, [dispatch, slug])

  return (
    <div className="">
      {/* Main Product Section */}
      <div className="bg-primary p-5 my-5">
        <div className="flex flex-col md:flex-row">
          {/* Left - Images */}
          <div className="lg:w-1/2 w-full flex flex-col lg:flex-row gap-4">
            {/* Thumbnail Images */}
            <div className="flex flex-row lg:flex-col order-2 lg:order-1 gap-2 w-full lg:w-26 ">
              {product?.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`cursor-pointer border-2 overflow-hidden aspect-square ${selectedImage === index
                    ? "border-secondary2"
                    : "border-secondary"
                    }`}
                >
                  <img
                    src={image?.url}
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
                src={product?.images[selectedImage]?.url}
              />
            </div>
          </div>

          {/* Right - Details */}
          <div className="lg:w-1/2 w-full md:pl-5 mt-6 md:mt-0">
            <h2 className="text-sm text-text1 tracking-wider uppercase">
              {product?.brand}
            </h2>
            <h1 className="text-text2 text-xl md:text-3xl font-medium">
              {product?.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center justify-between my-2">
              <div className="flex items-center">
                <span className="flex flex-col sm:flex-row gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <LuStar
                        key={index}
                        className={`w-4 h-4 ${index < Math.floor(product?.ratings)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-text1 sm:ml-2">
                    {product?.numReviews} Reviews
                  </span>
                </span>
                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 gap-2">
                  {product?.stock > 0 ? (
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
                Rs.{product?.price.toLocaleString()}
              </span>
              <span className="text-lg text-text1 line-through">
                Rs.{product?.oldPrice.toLocaleString()}
              </span>
              <span className="bg-btn1/10 text-btn1 px-3 py-1 rounded-full text-sm font-semibold">
                {product?.discount}% OFF
              </span>
            </div>

            {/* Short Description */}
            <p className="leading-relaxed mb-4 text-text1">
              {product?.shortDesc}
            </p>

            {/* Color & Size Selection */}
            <div className="flex flex-col gap-3 pt-5 border-t border-text2/50 mb-5">
              {
                product?.color.length !== 0 ? <div className="flex items-center">
                  <span className="mr-3 font-semibold">Color: </span>
                  {product?.color.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      style={{ backgroundColor: color }}
                      className={`border-2 rounded-full w-6 h-6 focus:outline-none ml-1 ${selectedColor === index
                        ? "border-secondary2"
                        : "border-text1"
                        }`}
                    ></button>
                  ))}
                </div> : ""
              }
              {
                product?.size.length !== 0 ? <div className="flex items-center">
                  <span className="mr-3 font-semibold">Size: </span>
                  {product?.size.map((size, index) => (
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
                </div> : ""
              }
            </div>

            {/* Product quantity update */}
            <div className="flex items-center gap-3 mb-6">
              <span className="mr-3 font-semibold">Quantity:</span>
              <div className="flex items-center border-2 border-text1 rounded overflow-hidden">
                <button className="px-4 py-2 hover:bg-btn2 hover:text-text transition-colors duration-300 font-semibold disabled:bg-gray-200 disabled:text-gray-500 text-text2 cursor-pointer" onClick={() => setquantity(quantity - 1)} disabled={quantity <= 1}>
                  −
                </button>
                <span className="px-6 py-2 text-center font-semibold text-text2 border-l-2 border-r-2 border-text1 min-w-16">
                  {quantity}
                </span>
                <button className="px-4 py-2 hover:bg-btn2 disabled:bg-gray-200 disabled:text-gray-500 transition-colors duration-300 font-semibold text-text2 hover:text-text cursor-pointer" onClick={() => setquantity(quantity + 1)} disabled={quantity >= 4}>
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
                    product?.stock > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {product?.stock > 0
                    ? `${product?.stock} Available`
                    : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Delivery:</span>
                <span className="text-gray-900 font-semibold">
                  Rs.{product?.shippingPrice}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Return:</span>
                <span className="text-gray-900 font-semibold">
                  {product?.returned} days
                </span>
              </div>
              {/* <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Warranty:</span>
                <span className="text-gray-900 font-semibold">
                  {product.warranty}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-primary p-5 my-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Description
        </h2>
        <p className="text-gray-700 leading-relaxed">{product?.longDesc}</p>
      </div>

      {/* Specifications */}
      <div className="bg-primary p-5 my-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {product?.specifications?.map((spec, i) => (
            <div key={i} className="flex border-b border-gray-200 py-2">
              <span className="font-semibold text-gray-700 w-1/2">{spec.key}</span>
              <span className="text-gray-900 w-1/2">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-primary p-5 my-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text2">
          Customer Reviews ({reviews?.length})
        </h2>
      </div>

      {
        reviews?.length != 0 && <div className="bg-primary p-5 my-5">
          {/* Reviews List */}
          <div className="space-y-6">
            {reviews?.map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-200 pb-6 last:border-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">
                        {review.username}
                      </span>
                      {/* {review.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                        ✓ Verified Purchase
                      </span>
                    )} */}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, index) => (
                          <LuStar
                            key={index}
                            className={`w-4 h-4 ${index < review?.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review?.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review?.message}</p>

                {/* Review Images */}
                {review?.images && review?.images?.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {review?.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img?.url}
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
      }

      {/* Related Products */}
      {relatedProducts.length != 0 && <div className="bg-primary p-5 my-5">
        <Heading title={"Related Item"} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </div>}
    </div>
  );
}
