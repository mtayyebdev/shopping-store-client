import React from "react";

function DealsCard({ section }) {
  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-base md:text-lg font-bold text-gray-900">
          {section.title}
        </h3>
        <Link
          to={section.link}
          className="flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-300"
        >
          <LuChevronRight className="w-5 h-5 text-white" />
        </Link>
      </div>

      {/* Products Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {section.products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group"
          >
            <div className="flex flex-col">
              {/* Product Image */}
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h4 className="text-xs md:text-sm font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                  {product.name}
                </h4>
                <p
                  className={`text-xs md:text-sm font-semibold ${getOfferColor(
                    product.offerType
                  )}`}
                >
                  {product.offer}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DealsCard;
