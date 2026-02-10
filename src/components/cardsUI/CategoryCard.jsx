import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({category}) {
  return (
    <Link key={category?._id} to={`/shop?c=${category?.slug}`} className="group">
      <div className="bg-white overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={category?.image?.url || "https://via.placeholder.com/300x300?text=No+Image"}
            alt={category?.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Category Info */}
        <div className="p-2 text-center">
          <h3 className="text-sm md:text-base font-semibold text-text2">
            {category?.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
