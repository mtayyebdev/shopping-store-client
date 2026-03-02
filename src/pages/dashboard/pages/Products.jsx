import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaBoxOpen, FaExclamationTriangle, FaChartLine, FaTimes } from 'react-icons/fa';
import { LuBox, LuPackageCheck, LuShieldCheck, LuSparkles, LuStar } from 'react-icons/lu';
import { Button, Input, Pagination, QuillEditor, } from '../../../components/index'
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, getProducts, updateProduct, deleteProduct, updateProductStatus } from '../../../store/adminSlices/ProductsSlice';
import { getAllCategories } from '../../../store/adminSlices/CategorySlice';
import { capitalizeFirstLetter, formatAmount, getPlainHTML } from '../../../custom methods/index';
import { toast } from 'react-toastify';

function Products() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.categorySlice);
  const { products, outOfStock, lowStock, totalProducts, totalRevenue,totalProductsStats, totalPages } = useSelector((state) => state.productsAdminSlice);
  const { currency } = useSelector((state) => state.userSlice);
  const [search, setSearch] = useState('');
  const [page, setpage] = useState(1);
  const [limit] = useState(20);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [eventAccured, seteventAccured] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productId, setproductId] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    brand: "no brand",
    categoryId: "",
    sku: "",
    isFeatured: "false",
    actionStatus: "active",
    price: "",
    oldPrice: "",
    stock: "",
    shippingPrice: "",
    returned: "7",
    tags: [],
    size: [],
    color: [],
    specifications: [],
  });
  const [editMainImage, setEditMainImage] = useState(null);
  const [editGalleryImages, setEditGalleryImages] = useState([]);
  const [shortDesc, setshortDesc] = useState("")
  const [longDesc, setlongDesc] = useState("")
  const [categoryFilters, setcategoryFilters] = useState([]);
  const [allCategories, setallCategories] = useState([]);
  const [stringSpecifications, setStringSpecifications] = useState([{ label: "", content: "" }]);
  const [imgsIds, setimgsIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    return () => {
      if (editMainImage?.preview) {
        URL.revokeObjectURL(editMainImage.preview);
      }
      editGalleryImages.forEach((img) => {
        if (img?.url && !img?.isExisting) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [editMainImage, editGalleryImages]);

  useEffect(() => {
    dispatch(getProducts({ page, limit, searchName: search, status: statusFilter }));
  }, [dispatch, page, limit, search, eventAccured, statusFilter]);

  const getcategories = async () => {
    const res = await dispatch(getAllCategories());
    if (res.type === "getallcategories/fulfilled") {
      const fetchedCategories = res.payload?.data || [];
      setallCategories(fetchedCategories);
      return fetchedCategories;
    }
    return [];
  };

  // Stats data
  const stats = [
    {
      id: 1,
      title: "Total Products",
      value: totalProductsStats,
      icon: LuBox,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-600"
    },
    {
      id: 2,
      title: "Out of Stock",
      value: outOfStock,
      icon: FaBoxOpen,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      textColor: "text-red-600"
    },
    {
      id: 3,
      title: "Low Stock",
      value: lowStock,
      icon: FaExclamationTriangle,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-600"
    },
    {
      id: 4,
      title: "Total Revenue",
      value: totalRevenue,
      icon: FaChartLine,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-600"
    }
  ];

  const getProductImage = (product) => product?.image?.url || product?.image || "";
  const getProductCategoryName = (product) => product?.category_info?.name || product?.category || "-";

  const handleViewProduct = async (productId) => {
    await dispatch(getProduct(productId))
      .then((res) => {
        if (res.type === "getproduct/fulfilled") {
          setSelectedProduct(res.payload.data);
          setViewModal(true);
        }
      })
  };

  const handleEditProduct = async (productId) => {
    setproductId(productId);
    let product = null;
    await dispatch(getProduct(productId))
      .then((res) => {
        if (res.type === "getproduct/fulfilled") {
          product = res.payload.data;
        }
      })

    if (!product) return;

    const productCategoryId = product?.category?._id || product?.category || "";
    const allSpecifications = Array.isArray(product?.specifications)
      ? product.specifications.map((spec) => ({
        label: spec?.label || spec?.lable || "",
        content: spec?.content,
      }))
      : [];
    const arraySpecifications = allSpecifications
      .filter((spec) => Array.isArray(spec?.content))
      .map((spec) => ({
        label: spec.label,
        content: spec.content.map((item) => String(item)).filter(Boolean),
      }));
    const nonArraySpecifications = allSpecifications
      .filter((spec) => !Array.isArray(spec?.content))
      .map((spec) => ({
        label: spec.label,
        content: spec?.content ? String(spec.content) : "",
      }));

    setSelectedProduct(product);

    setUpdateFormData({
      name: product?.name || "",
      brand: product?.brand || "no brand",
      categoryId: productCategoryId,
      sku: product?.sku || "",
      isFeatured: String(Boolean(product?.isFeatured)),
      price: product?.price || "",
      oldPrice: product?.oldPrice || "",
      stock: product?.stock || "",
      shippingPrice: product?.shippingPrice || "",
      actionStatus: product?.actionStatus || "",
      returned: product?.returned || "7",
      tags: Array.isArray(product?.tags) ? product.tags : [],
      size: Array.isArray(product?.size) ? product.size : [],
      color: Array.isArray(product?.color) ? product.color : [],
      specifications: arraySpecifications,
    });

    setshortDesc(product?.shortDesc || "");
    setlongDesc(product?.longDesc || "");
    setStringSpecifications(
      nonArraySpecifications?.length > 0
        ? nonArraySpecifications
        : [{ label: "", content: "" }]
    );

    setEditMainImage(
      getProductImage(product)
        ? {
          id: `${product._id}-main`,
          preview: getProductImage(product),
          isExisting: true,
        }
        : null
    );
    setEditGalleryImages(
      Array.isArray(product?.images)
        ? product.images.map((img, index) => ({
          url: img?.url || img,
          publicId: img?.publicId || `${product._id}-existing-${index}`,
          isExisting: true,
        }))
        : []
    );
    setimgsIds([]);

    const categories = await getcategories();
    const sourceCategories = categories.length > 0 ? categories : allCategories;
    const category = sourceCategories.find((c) => c?._id === productCategoryId);
    setcategoryFilters(category?.filters || []);

    setEditModal(true);
  };

  const openDelete = (product) => {
    setSelectedProduct(product)
    setdeleteModal(true)
  }

  const handleDeleteProduct = async () => {
    await dispatch(deleteProduct(selectedProduct?._id))
      .then((res) => {
        if (res.type === "deleteproduct/fulfilled") {
          toast.success(res.payload?.message);
          seteventAccured(!eventAccured)
        } else {
          toast.error(res.payload?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
    setdeleteModal(false);
  }

  const handleCloseModals = () => {
    setViewModal(false);
    setEditModal(false);
    setdeleteModal(false);
    setSelectedProduct(null);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTags = (value) => {
    const tags = value?.split(",")?.map((t) => t.trim()?.toLowerCase())?.filter(Boolean);
    setUpdateFormData((prev) => ({ ...prev, tags }));
  };

  const handleUpdateCategoryChange = async (id) => {
    setUpdateFormData((prev) => ({
      ...prev,
      categoryId: id,
      brand: "no brand",
      size: [],
      color: [],
      specifications: [],
    }));

    const categories = await getcategories();
    const sourceCategories = categories.length > 0 ? categories : allCategories;
    const category = sourceCategories.find((c) => c._id === id);
    setcategoryFilters(category?.filters || []);
  };

  const getFilterValues = (name) => {
    if (!categoryFilters?.length) return [];
    const filter = categoryFilters.find((f) => f.name === name);
    return filter?.values || [];
  };

  const removeFilters = (fields) => {
    if (!categoryFilters?.length) return [];
    return categoryFilters.filter((f) => !fields.includes(f.name));
  };

  const getSpecChecked = (name, value) => {
    const spec = updateFormData.specifications?.find((s) => s.label === name) || null;
    if (!spec) return false;
    return Array.isArray(spec?.content) && spec.content.includes(value);
  };

  const handleChangeFilters = (event, field) => {
    const checked = event.target.checked;
    const value = event.target.value;

    if (field === "color" || field === "size") {
      setUpdateFormData((prev) => {
        const values = prev[field] || [];
        return {
          ...prev,
          [field]: checked
            ? values.includes(value)
              ? values
              : [...values, value]
            : values.filter((v) => v !== value),
        };
      });
      return;
    }

    setUpdateFormData((prev) => {
      const currentSpecs = prev.specifications || [];
      let spec = currentSpecs.find((s) => s?.label === field) || null;

      if (spec) {
        const values = Array.isArray(spec.content) ? spec.content : [];
        if (checked) {
          if (!values.includes(value)) {
            spec = { ...spec, content: [...values, value] };
          }
        } else {
          spec = { ...spec, content: values.filter((v) => v !== value) };
        }
      } else {
        spec = { label: field, content: [value] };
      }

      const anotherSpecs = currentSpecs.filter((s) => s.label !== field);
      return { ...prev, specifications: [...anotherSpecs, spec] };
    });
  };

  const handleSpecLabelChange = (index, value) => {
    setStringSpecifications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], label: value };
      return next;
    });
  };

  const handleSpecContentChange = (index, value) => {
    setStringSpecifications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], content: value };
      return next;
    });
  };

  const addSpec = () => {
    setStringSpecifications((prev) => [...prev, { label: "", content: "" }]);
  };

  const removeSpec = (index) => {
    setStringSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const getNonCategoryArraySpecs = () => {
    const categorySpecNames = removeFilters(["color", "size", "brand"]).map((f) => f.name);
    return (updateFormData.specifications || []).filter(
      (spec) => spec?.label && Array.isArray(spec?.content) && !categorySpecNames.includes(spec.label)
    );
  };

  const handleEditMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (editMainImage?.preview && !editMainImage?.isExisting) {
      URL.revokeObjectURL(editMainImage.preview);
    }

    setEditMainImage({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.lastModified}`,
      isExisting: false,
    });
  };

  const handleEditGalleryImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const previewFiles = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      publicId: `${file.name}-${file.lastModified}-MAINIMG-${Math.random().toString(36).slice(2, 8)}`,
      isExisting: false,
    }));

    setEditGalleryImages((prev) => [...prev, ...previewFiles].slice(0, 16));
  };

  const removeEditMainImage = () => {
    if (editMainImage?.preview && !editMainImage?.isExisting) {
      URL.revokeObjectURL(editMainImage.preview);
    }
    setEditMainImage(null);
  };

  const removeEditGalleryImage = (imageId) => {
    if (!imgsIds.includes(imageId)) {
      if (!String(imageId).includes("-MAINIMG-")) {
        setimgsIds([...imgsIds, imageId]);
      }
    }

    setEditGalleryImages((prev) => {
      const target = prev.find((img) => img.publicId === imageId);
      if (target?.url && !target?.isExisting) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.publicId !== imageId);
    });
  };

  // update product in backend.....
  const updateProductHandler = async () => {
    const productData = new FormData();
    if (editMainImage?.file) {
      productData.append("image", editMainImage?.file);
    }
    editGalleryImages?.forEach((img) => {
      if (img?.file) {
        productData.append("images", img.file);
      }
    })

    const normalizedArraySpecifications = (updateFormData.specifications || [])
      .filter((spec) => spec?.label && Array.isArray(spec?.content))
      .map((spec) => ({
        label: spec.label.trim(),
        content: spec.content.map((item) => String(item).trim()).filter(Boolean),
      }));

    const normalizedStringSpecifications = (stringSpecifications || [])
      .filter((s) => s?.label?.trim() && s?.content?.trim())
      .map((s) => ({
        label: s.label.trim(),
        // backend schema expects array content, so wrap single text value.
        content: [s.content.trim()],
      }));
    const mergedSpecifications = [...normalizedArraySpecifications, ...normalizedStringSpecifications];

    productData.append("name", updateFormData.name);
    productData.append("price", Number(updateFormData.price));
    productData.append("oldPrice", Number(updateFormData.oldPrice));
    productData.append("stock", Number(updateFormData.stock));
    productData.append("tags", JSON.stringify(updateFormData.tags || []));
    productData.append("shippingPrice", Number(updateFormData.shippingPrice));
    productData.append("longDesc", longDesc);
    productData.append("shortDesc", shortDesc);
    productData.append("returned", Number(updateFormData.returned));
    productData.append("sku", updateFormData.sku);
    productData.append("isFeatured", updateFormData.isFeatured);
    productData.append("size", JSON.stringify(updateFormData.size || []));
    productData.append("color", JSON.stringify(updateFormData.color || []));
    productData.append("brand", updateFormData.brand);
    productData.append("category", updateFormData.categoryId);
    productData.append("specifications", JSON.stringify(mergedSpecifications));
    productData.append("imgsIdsToDelete", JSON.stringify(imgsIds));

    await dispatch(updateProduct({ productId, productData }))
      .then((res) => {
        if (res.type === "updateproduct/fulfilled") {
          toast.success(res.payload?.message);
          setEditModal(false);
          seteventAccured(!eventAccured);
        } else {
          toast.error(res.payload?.message || "Failed to update product");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleUpdateProductStatus = async (productId, status) => {
    dispatch(updateProductStatus({ productId, status }))
      .then((res) => {
        if (res.type === "updateproductstatus/fulfilled") {
          toast.success(res.payload?.message);
          seteventAccured(!eventAccured);
        } else {
          toast.error(res.payload?.message || "Failed to update product status");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                {stat.title == "Total Revenue" ? <h3 className="text-2xl font-bold text-gray-800">{currency?.symbol}{formatAmount(stat.value)}</h3> : <h3 className="text-2xl font-bold text-gray-800">{formatAmount(stat.value)}</h3>}
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                <stat.icon className={`${stat.iconColor} text-2xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Products Card */}
      <div className="bg-white p-5 rounded-2xl shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold">All Products</h3>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by Product Name and SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
            <Button bg='btn2' icon={<FaPlus size={15} />} link='/web-admin/create-product' size='md' value='Create Product' style='base' />

          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto block overflow-hidden">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Product</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Category</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Price</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Stock</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Sold</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product._id} className="border-b border-gray-200 transition-colors">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getProductImage(product)}
                        alt={product?.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-gray-600">{getProductCategoryName(product)}</p>
                  </td>
                  <td className="px-2 py-3">
                    <p className="font-semibold text-gray-800">{currency?.symbol}{formatAmount(product?.price)}</p>
                  </td>
                  <td className="px-2 py-3 text-nowrap">
                    {product.stock > 0 ? (
                      <span className="text-green-600 font-medium">{product.stock} in stock</span>
                    ) : (
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-gray-600">{formatAmount(product.sold)}</p>
                  </td>
                  <td className="px-2 py-3">
                    <select
                      value={product.actionStatus}
                      onChange={(e) => handleUpdateProductStatus(product._id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm font-medium  focus:outline-none`}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspend</option>
                      <option value="deleted">Delete</option>
                    </select>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                        onClick={() => handleViewProduct(product?._id)}
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                        onClick={() => handleEditProduct(product?._id)}
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        onClick={() => openDelete(product)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination page={page} limit={limit} setpage={setpage} totalPages={totalPages} NumberOfItems={totalProducts} title="Products" />
      </div>

      {/* View Product Modal */}
      {viewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
              <button
                onClick={handleCloseModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <img
                    src={getProductImage(selectedProduct)}
                    alt={selectedProduct?.name}
                    className="w-full h-72 object-cover rounded-xl shadow-md"
                  />
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedProduct?.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">SKU: {selectedProduct?.sku || "-"}</p>
                    <p className="text-gray-500 text-xs mt-1 font-mono">ID: {selectedProduct?._id}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-lg font-semibold text-gray-800">{currency?.symbol}{formatAmount(selectedProduct?.price)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Old Price</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {selectedProduct?.oldPrice ? `${currency?.symbol}${formatAmount(selectedProduct.oldPrice)}` : "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className="text-lg font-semibold text-gray-800">{formatAmount(selectedProduct?.stock) ?? 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Sold</p>
                      <p className="text-lg font-semibold text-gray-800">{formatAmount(selectedProduct?.sold) ?? 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <LuStar size={18} fill="yellow" color="yellow" />
                    <span className="font-semibold text-gray-700">{selectedProduct?.ratings || 0}</span>
                    <span className="text-gray-500 text-sm">({selectedProduct?.numReviews || 0} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedProduct?.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedProduct.stock > 0 ? `${formatAmount(selectedProduct.stock)} in stock` : 'Out of Stock'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedProduct?.actionStatus === "active" ? 'bg-green-100 text-green-700' : selectedProduct?.actionStatus === "suspended" ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedProduct.actionStatus === "active" ? "Active" : selectedProduct.actionStatus === "suspended" ? "Suspended" : "Deleted"}
                    </span>
                  </div>
                  <div>

                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2 space-y-5">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-2">Short Description</h4>
                    <div className="text-gray-600">{getPlainHTML(selectedProduct?.shortDesc) || "-"}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-2">Long Description</h4>
                    <div className="text-gray-600">{getPlainHTML(selectedProduct?.longDesc) || "-"}</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3">Gallery Images</h4>
                    {Array.isArray(selectedProduct?.images) && selectedProduct?.images?.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {selectedProduct.images.map((img, index) => (
                          <img
                            key={`${img?.url || img}-${index}`}
                            src={img?.url || img}
                            alt={`Gallery ${index + 1}`}
                            className="w-full aspect-square rounded-lg object-cover border border-gray-200"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No gallery images available.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3">Meta Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700"><span className="font-semibold">Category:</span> {selectedProduct?.category?.name}</p>
                      <p className="text-gray-700"><span className="font-semibold">Brand:</span> {selectedProduct?.brand || "-"}</p>
                      <p className="text-gray-700"><span className="font-semibold">Slug:</span> {selectedProduct?.slug || "-"}</p>
                      <p className="text-gray-700"><span className="font-semibold">Shipping:</span> {selectedProduct?.shippingPrice ? `${currency?.symbol}${formatAmount(selectedProduct?.shippingPrice)}` : "-"}</p>
                      <p className="text-gray-700"><span className="font-semibold">Return:</span> {selectedProduct?.returned || "-"}</p>
                      <p className="text-gray-700"><span className="font-semibold">Featured:</span> {selectedProduct?.isFeatured ? "Yes" : "No"}</p>
                      <p className="text-gray-700"><span className="font-semibold">Created:</span> {selectedProduct?.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : "-"}</p>
                      <p className="text-gray-700"><span className="font-semibold">Updated:</span> {selectedProduct?.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleString() : "-"}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3">Attributes</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedProduct?.tags) && selectedProduct.tags.length > 0 ? (
                            selectedProduct.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">{tag}</span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Sizes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedProduct?.size) && selectedProduct.size.length > 0 ? (
                            selectedProduct.size.map((size) => (
                              <span key={size} className="px-2 py-0.5 text-xs rounded-full bg-violet-100 text-violet-700">{size}</span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Colors</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedProduct?.color) && selectedProduct?.color?.length > 0 ? (
                            selectedProduct.color.map((color) => (
                              <span key={color} className="px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-700">{color}</span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Specifications</h4>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      {Array.isArray(selectedProduct?.specifications) && selectedProduct?.specifications?.length > 0 ? (
                        <div className="space-y-2">
                          {selectedProduct.specifications.map((spec, index) => (
                            <div key={`${spec?.lable || spec?.label}-${index}`} className="flex justify-between gap-3 text-sm border-b border-gray-200 pb-1 last:border-b-0 last:pb-0">
                              <span className="font-medium text-gray-700">{spec?.lable || spec?.label || "-"}</span>
                              <span className="text-gray-600 text-right">{spec?.content || "-"}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No specifications available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">
                  <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
                      <LuPackageCheck className="text-blue-600" size={20} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          label
                          labelText="Product Name"
                          name="name"
                          value={updateFormData.name}
                          onChange={handleUpdateFormChange}
                          placeholder="e.g. Premium Cotton Hoodie"
                          size="xl"
                          classes="border-gray-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block" htmlFor="update-brand">Brand</label>
                        <select
                          id="update-brand"
                          name="brand"
                          value={updateFormData.brand}
                          onChange={handleUpdateFormChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="no brand">No Brand</option>
                          {getFilterValues("brand")?.length > 0 && getFilterValues("brand")?.map((brand) => (
                            <option key={brand} value={brand}>{capitalizeFirstLetter(brand)}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
                        <select
                          name="categoryId"
                          value={updateFormData.categoryId}
                          onChange={(e) => handleUpdateCategoryChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="">
                            {loading ? "Loading categories..." : "Select Category"}
                          </option>
                          {allCategories?.map((category) => (
                            <option key={category?._id} value={category?._id}>
                              {category?.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Selected Category ID: {updateFormData.categoryId || "-"}
                        </p>
                      </div>

                      <div>
                        <Input
                          label
                          labelText="SKU"
                          name="sku"
                          value={updateFormData.sku}
                          onChange={handleUpdateFormChange}
                          placeholder="e.g. HD-PRM-001"
                          size="xl"
                          classes="border-gray-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Featured Product</label>
                        <select
                          name="isFeatured"
                          value={updateFormData.isFeatured}
                          onChange={handleUpdateFormChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h2>
                      <LuShieldCheck className="text-green-600" size={20} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="number"
                        label
                        labelText="Price"
                        name="price"
                        value={updateFormData.price}
                        onChange={handleUpdateFormChange}
                        placeholder="0.00"
                        size="xl"
                        classes="border-gray-300 bg-white"
                      />
                      <Input
                        type="number"
                        label
                        labelText="Old Price"
                        name="oldPrice"
                        value={updateFormData.oldPrice}
                        onChange={handleUpdateFormChange}
                        placeholder="0.00"
                        size="xl"
                        classes="border-gray-300 bg-white"
                      />
                      <Input
                        type="number"
                        label
                        labelText="Stock"
                        name="stock"
                        value={updateFormData.stock}
                        onChange={handleUpdateFormChange}
                        placeholder="0"
                        size="xl"
                        classes="border-gray-300 bg-white"
                      />
                      <Input
                        type="number"
                        label
                        labelText="Shipping Price"
                        name="shippingPrice"
                        value={updateFormData.shippingPrice}
                        onChange={handleUpdateFormChange}
                        placeholder="0.00"
                        size="xl"
                        classes="border-gray-300 bg-white"
                      />

                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Return Policy</label>
                        <select
                          name="returned"
                          value={updateFormData.returned}
                          onChange={handleUpdateFormChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="7">7 Days Return</option>
                          <option value="14">14 Days Return</option>
                          <option value="30">30 Days Return</option>
                          <option value="0">No Return</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Descriptions</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Short Description</label>
                        <QuillEditor setValue={setshortDesc} value={shortDesc} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Long Description</label>
                        <QuillEditor setValue={setlongDesc} value={longDesc} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-800">Product Specifications</h4>
                          <button
                            type="button"
                            onClick={addSpec}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                          >
                            <FaPlus size={11} /> Add Specification
                          </button>
                        </div>
                        <div className="space-y-2">
                          {stringSpecifications?.map((spec, i) => (
                            <div key={`edit-spec-${i}`} className="flex gap-2 items-center flex-wrap">
                              <input
                                type="text"
                                value={spec?.label}
                                onChange={(e) => handleSpecLabelChange(i, e.target.value)}
                                placeholder="Specification Name"
                                className="border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={spec?.content}
                                onChange={(e) => handleSpecContentChange(i, e.target.value)}
                                placeholder="Write about..."
                                className="border border-gray-300 min-w-80 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => removeSpec(i)}
                                className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-5">
                  <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Media Upload</h2>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Main View Image</span>
                        <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center bg-blue-50/70">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditMainImageChange}
                            className="block w-full text-sm text-gray-500"
                          />
                          {editMainImage && (
                            <div className="mt-3 relative w-24 h-24 rounded-lg border border-blue-200 overflow-hidden bg-white mx-auto">
                              <img src={editMainImage.preview} alt="Main preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={removeEditMainImage}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center"
                              >
                                <FaTimes size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Gallery Images</span>
                        <div className="border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center bg-emerald-50/70">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleEditGalleryImagesChange}
                            className="block w-full text-sm text-gray-500"
                          />
                          {editGalleryImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              {editGalleryImages.map((img) => (
                                <div key={img.publicId} className="relative w-full aspect-square rounded-lg overflow-hidden border border-emerald-200">
                                  <img src={img.url} alt="Gallery preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeEditGalleryImage(img.publicId)}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center"
                                  >
                                    <FaTimes size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </section>

                  <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">Variants & Meta</h2>
                      <LuSparkles className="text-yellow-500" size={20} />
                    </div>
                    <div className="space-y-3">
                      <Input
                        label
                        labelText="Tags"
                        name="tags"
                        value={Array.isArray(updateFormData.tags) ? updateFormData.tags.join(", ") : ""}
                        onChange={(e) => handleChangeTags(e.target.value)}
                        placeholder="tag1, tag2"
                        size="xl"
                        classes="border-gray-300 bg-white"
                      />
                      <div className="flex items-center flex-wrap gap-1.5 -mt-1">
                        {updateFormData.tags?.map((tag, index) => (
                          <span key={`${tag}-${index}`} className="bg-blue-500 text-white px-2 py-1 text-sm rounded-md font-semibold">
                            {capitalizeFirstLetter(tag)}
                          </span>
                        ))}
                      </div>
                      <div>
                        {getFilterValues("size")?.length > 0 ? (
                          <>
                            <p className="text-sm font-medium text-gray-700 mb-1.5">Select Sizes</p>
                            {getFilterValues("size").map((size, index) => (
                              <div key={`${size}-${index}`} className="flex items-center gap-2 font-semibold">
                                <input
                                  type="checkbox"
                                  id={`edit-size-${size}`}
                                  value={size}
                                  checked={updateFormData.size.includes(size)}
                                  onChange={(e) => handleChangeFilters(e, "size")}
                                />
                                <label htmlFor={`edit-size-${size}`}>{size}</label>
                              </div>
                            ))}
                          </>
                        ) : null}
                      </div>
                      <div>
                        {getFilterValues("color")?.length > 0 ? (
                          <>
                            <p className="text-sm font-medium text-gray-700 mb-1.5">Select Colors</p>
                            {getFilterValues("color").map((color, index) => (
                              <div key={`${color}-${index}`} className="flex items-center gap-2 font-semibold">
                                <input
                                  type="checkbox"
                                  id={`edit-color-${color}`}
                                  value={color}
                                  checked={updateFormData.color.includes(color)}
                                  onChange={(e) => handleChangeFilters(e, "color")}
                                />
                                <label htmlFor={`edit-color-${color}`}>{color}</label>
                              </div>
                            ))}
                          </>
                        ) : null}
                      </div>
                      <div>
                        {removeFilters(["color", "size", "brand"])?.length > 0 && (
                          <div className="mb-2">
                            {removeFilters(["color", "size", "brand"])?.map((filter, i) => (
                              <div key={`${filter?.name}-${i}`} className="mb-2">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Select {capitalizeFirstLetter(filter?.name)}
                                </p>
                                {getFilterValues(filter?.name).map((value, index) => (
                                  <div key={`${value}-${index}`} className="flex items-center gap-2 font-semibold">
                                    <input
                                      type="checkbox"
                                      id={`edit-filter-${filter?.name}-${value}`}
                                      value={value}
                                      checked={getSpecChecked(filter?.name, value)}
                                      onChange={(e) => handleChangeFilters(e, filter?.name)}
                                    />
                                    <label htmlFor={`edit-filter-${filter?.name}-${value}`}>{value}</label>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        {getNonCategoryArraySpecs()?.length > 0 && (
                          <div className="mb-2">
                            {getNonCategoryArraySpecs().map((spec, i) => (
                              <div key={`${spec?.label}-${i}`} className="mb-2">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Select {capitalizeFirstLetter(spec?.label)}
                                </p>
                                {spec?.content?.map((value, index) => (
                                  <div key={`${value}-${index}`} className="flex items-center gap-2 font-semibold">
                                    <input
                                      type="checkbox"
                                      id={`edit-array-spec-${spec?.label}-${value}`}
                                      value={value}
                                      checked={getSpecChecked(spec?.label, value)}
                                      onChange={(e) => handleChangeFilters(e, spec?.label)}
                                    />
                                    <label htmlFor={`edit-array-spec-${spec?.label}-${value}`}>{value}</label>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={updateProductHandler}
                  className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Product Permenetly</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-semibold">{selectedProduct?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={handleCloseModals} className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
              <button type="button" onClick={handleDeleteProduct} className="flex-1 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Products
