import { useState, useEffect } from "react";
import { LuSlidersHorizontal, LuX, LuChevronDown, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ProductCard, Button } from '../components/index.js'
import { useSearchParams } from 'react-router-dom'
import { searchProducts } from '../store/publicSlices/ProductsSlice.jsx'
import { useDispatch } from 'react-redux'
import { PriceRange, Ratings, Btn, Checkbox } from '../components/filtersUI/index.js'

export default function Shop() {
    const dispatch = useDispatch();
    const search = useSearchParams();
    const searchedValue = search[0].get("s");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("bestMatch");
    const [currentProducts, setcurrentProducts] = useState([]);
    const [filters, setfilters] = useState([]);
    const FILTER_COMPONENTS = {
        btn: Btn,
        checkbox: Checkbox,
    };

    const productsPerPage = 10;

    // Filter states
    const [priceRange, setPriceRange] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [totalpages, settotalpages] = useState(0)
    const [selectedValues, setselectedValues] = useState({}); // key : [values]

    const clearAllFilters = () => {
        setPriceRange(null);
        setselectedValues({})
        setSelectedRating(0);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const filters = {
                ratings: selectedRating,
                sortBy,
                page: currentPage,
                limit: productsPerPage,
                allFilters: selectedValues
            }
            if (priceRange) {
                filters.minPrice = priceRange[0];
                filters.maxPrice = priceRange[1];
            }
            
            await dispatch(searchProducts({ search: searchedValue, filters }))
                .then((res) => {
                    if (res.type === "search/fulfilled") {
                        setcurrentProducts(res.payload.data);
                        settotalpages(res.payload.totalPages);
                        setfilters(res.payload.filters);
                    }
                })
        };
        fetchProducts();
    }, [searchedValue, sortBy, priceRange, selectedRating, currentPage, productsPerPage, selectedValues])

    return (
        <div className="min-h-screen py-6">
            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-20"
                ></div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Left Sidebar - Filters */}
                <div
                    className={`lg:col-span-1 fixed lg:relative inset-y-0 left-0 top-52 shop-sideBar md:top-30 lg:top-0 z-25 w-80 lg:w-auto transform transition-transform duration-300 lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        }`}
                >
                    <div className="bg-primary rounded p-4 h-screen lg:h-auto overflow-y-auto">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-text2">Filters</h2>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden text-text1 hover:text-text2"
                            >
                                <LuX className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Clear All */}
                        <button
                            onClick={clearAllFilters}
                            className="w-full text-blue-600 hover:text-blue-700 font-semibold text-sm mb-4 cursor-pointer transition-colors duration-300"
                        >
                            Clear All Filters
                        </button>

                        {/* Price Range */}
                        <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />

                        {/* All filters */}
                        {filters?.map((filter) => {
                            const Component = FILTER_COMPONENTS[filter.type];
                            if (!Component) return null;

                            return <Component
                                key={filter.name}
                                selectedValues={selectedValues}
                                setSelectedValues={setselectedValues}
                                values={filter.values}
                                name={filter.name}
                            />;
                        })}

                        {/* Rating */}
                        <Ratings selectedRating={selectedRating} setSelectedRating={setSelectedRating} />
                    </div>
                </div>

                {/* Right - Products */}
                <div className="lg:col-span-3">
                    {/* Top Bar - Results & Sort */}
                    <div className="bg-primary rounded p-4 mb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex gap-3 items-center">
                                {/* Mobile Filter Button */}
                                <Button
                                    onClick={() => setIsSidebarOpen(true)}
                                    classes="lg:hidden py-2 px-2"
                                    icon={<LuSlidersHorizontal className="w-5 h-5" />}
                                    iconPosition="left"
                                    bg="btn2"
                                    size="md"
                                    value="Filters"
                                    style="base"
                                    paddings={false}
                                />
                                <div>
                                    <p className="text-text2 font-semibold text-lg">
                                        {searchedValue}
                                    </p>
                                    <p className="text-sm text-text1">
                                        {currentProducts?.length} items found for "{searchedValue}"
                                    </p>
                                </div>
                            </div>

                            {/* Sort By Dropdown */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-700">Sort By:</span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                                    >
                                        <option value="bestMatch">Best Match</option>
                                        <option value="LtoH">Price: Low to High</option>
                                        <option value="HtoL">Price: High to Low</option>
                                    </select>
                                    <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text1 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Applied Filters */}
                        <div className="flex flex-wrap gap-2 items-center mt-4">
                            {priceRange && (
                                <button
                                    onClick={() => setPriceRange(null)}
                                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                                >
                                    Rs.{priceRange[0]} - Rs.{priceRange[1]}
                                    <LuX className="w-4 h-4" />
                                </button>
                            )}
                            {selectedRating > 0 && (
                                <button
                                    onClick={() => setSelectedRating(0)}
                                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                                >
                                    {selectedRating}★ & above
                                    <LuX className="w-4 h-4" />
                                </button>
                            )}
                            {Object.entries(selectedValues).map(([key, values]) =>
                                values.map((value) => (
                                    <button
                                        key={`${key}-${value}`}
                                        onClick={() => setselectedValues(prev => ({
                                            ...prev,
                                            [key]: prev[key].filter(v => v !== value)
                                        }))}
                                        onMouseDown={(e)=>e.preventDefault()}
                                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                                    >
                                        {value}
                                        <LuX className="w-4 h-4" />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid p-2 grid-cols-2 sm:grid-cols-3 bg-primary lg:grid-cols-4 gap-4 pb-3">
                        {currentProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalpages > 1 && (
                        <div className="bg-primary rounded py-4 px-2">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-1.5 py-1 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                    <LuChevronLeft size={24} />
                                </button>

                                {[...Array(Math.min(5, totalpages))].map((_, i) => {
                                    let pageNum;
                                    if (totalpages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalpages - 2) {
                                        pageNum = totalpages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded font-medium transition-colors duration-300 ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalpages, prev + 1))}
                                    disabled={currentPage === totalpages}
                                    className="px-1.5 py-1 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                    <LuChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
