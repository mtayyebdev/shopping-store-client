import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({category}) {
  return (
    <Link key={category.id} to={`/category/${category.slug}`} className="group">
      <div className="bg-white shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Category Info */}
        <div className="p-2 text-center">
          <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
