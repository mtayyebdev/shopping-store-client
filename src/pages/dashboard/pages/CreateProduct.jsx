import React, { useEffect, useState, useRef } from "react";
import { FaCloudUploadAlt, FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import { Button, Input, QuillEditor } from "../../../components/index";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../store/adminSlices/ProductsSlice";
import { getAllCategories } from "../../../store/adminSlices/CategorySlice";
import { capitalizeFirstLetter } from '../../../custom methods/index'
import { toast } from "react-toastify";

function CreateProduct() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    brand: "no brand",
    categoryId: "",
    sku: "",
    isFeatured: false,
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
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [shortDesc, setshortDesc] = useState("")
  const [longDesc, setlongDesc] = useState("")
  const [categoryFilters, setcategoryFilters] = useState([])
  const [allCategories, setallCategories] = useState([])
  const [moreSpecification, setmoreSpecification] = useState([{ label: "", content: "" }])

  const getcategories = async () => {
    const res = await dispatch(getAllCategories());
    if (res.type === "getallcategories/fulfilled") {
      const categories = res.payload?.data || [];
      setallCategories(categories);
      return categories;
    }
    return [];
  };

  useEffect(() => {
    getcategories();
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (mainImage?.preview) {
        URL.revokeObjectURL(mainImage.preview);
      }
      galleryImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [mainImage, galleryImages]);

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mainImage?.preview) {
      URL.revokeObjectURL(mainImage.preview);
    }

    setMainImage({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.lastModified}`,
    });
  };

  const handleGalleryImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newPreviewFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    }));

    setGalleryImages((prev) => [...prev, ...newPreviewFiles].slice(0, 16));
  };

  const removeMainImage = () => {
    if (mainImage?.preview) {
      URL.revokeObjectURL(mainImage.preview);
    }
    setMainImage(null);
  };

  const removeGalleryImage = (imageId) => {
    setGalleryImages((prev) => {
      const target = prev.find((img) => img.id === imageId);
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeFilters = (event, field) => {
    const checked = event.target.checked;
    const value = event.target.value;

    if (field === "color" || field === "size") {
      setFormData((prev) => {
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
    } else {
      let spec = formData.specifications?.find((s) => s?.label == field) || null;

      if (spec) {
        let values = spec?.content;
        if (checked) {
          if (!values?.includes(value)) {
            spec.content = [...values, value];
          }
        } else {
          spec.content = values?.filter((v) => v != value);
        }
      } else {
        spec = { label: field, content: [value] };
      }

      const anotherSpecs = formData.specifications?.filter((s) => s.label != field);

      setFormData((prev) => ({
        ...prev,
        specifications: [...anotherSpecs, spec]
      }))
    }
  };

  const handleCategoryChange = async (id) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: id,
      size: [],
      color: [],
      specifications: [],
    }));

    const categories = await getcategories();
    const sourceCategories = categories.length > 0 ? categories : allCategories;
    const category = sourceCategories.find((c) => c._id === id);
    setcategoryFilters(category?.filters || []);
  };

  const handleChangeTags = (value) => {
    let tags = value?.split(",")?.map((t) => t.trim()?.toLowerCase());

    setFormData((prev) => ({
      ...prev,
      tags: tags
    }))
  }

  const handleSpecLabelChange = (index, value) => {
    let newSpec = [...moreSpecification];
    newSpec[index].label = value;
    setmoreSpecification(newSpec)
  }

  const handleSpecContentChange = (index, value) => {
    let newSpec = [...moreSpecification];
    newSpec[index].content = value;
    setmoreSpecification(newSpec)
  }

  const addSpec = () => {
    setmoreSpecification((prev) => (
      [...prev, { label: "", content: "" }]
    ))
  }

  const removeSpec = (index) => {
    setmoreSpecification((prev) => (prev.filter((s, i) => i !== index)))
  }

  const getFilterValues = (name) => {
    if (!categoryFilters?.length > 0) return [];

    const filter = categoryFilters?.find((f) => f.name === name);
    return filter?.values || [];
  };

  const removeFilters = (fields) => {
    if (!categoryFilters > 0) return;

    const filters = categoryFilters.filter((f) => ![...fields].includes(f.name));
    return filters;
  }

  const getSpecChecked = (name, value) => {
    const spec = formData.specifications.find((s) => s.label == name) || null;

    if (!spec) return false;

    return spec?.content?.includes(value);
  }

  const createProductHandler = async () => {
    const data = new FormData()
    data.append("name", formData.name)
    data.append("brand", formData.brand)
    data.append("categoryId", formData.categoryId);
    data.append("price", Number(formData.price));
    data.append("oldPrice", Number(formData.oldPrice));
    data.append("stock", Number(formData.stock));
    data.append("tags", JSON.stringify(formData.tags));
    data.append("shippingPrice", Number(formData.shippingPrice));
    data.append("longDesc", longDesc);
    data.append("shortDesc", shortDesc);
    data.append("returned", Number(formData.returned));
    data.append("sku", formData.sku);
    data.append("isFeatured", Boolean(formData.isFeatured));
    data.append("size", JSON.stringify(formData.size));
    data.append("color", JSON.stringify(formData.color));
    data.append("image", mainImage?.file);
    galleryImages.forEach((img) => {
      data.append("images", img?.file);
    })

    const totalSpecifications = [
      ...(formData.specifications || []),
      ...moreSpecification
    ]

    data.append("specifications", JSON.stringify(totalSpecifications))

    await dispatch(createProduct(data))
      .then((res) => {
        if (res.type === "createproduct/fulfilled") {
          toast.success(res.payload?.message)
        } else {
          toast.error(res.payload?.message)
        }
      })
      .catch((err) => {
        console.log(err);

      })
  }

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Catalog Management</p>
            <h1 className="text-2xl font-bold text-gray-800">Create New Product</h1>
            <p className="text-sm text-gray-500 mt-1">
              Build your product card with pricing, variants, media and descriptions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              bg="btn1"
              style="base"
              size="md"
              value="Back to Products"
              link="/web-admin/products"
              classes="min-w-40"
            />
            <button
              type="button"
              onClick={createProductHandler}
              className="py-2 px-6 rounded bg-btn2 text-text hover:bg-hover-btn2 focus:outline-none focus:ring-2 focus:ring-btn2 focus:ring-opacity-75 min-w-40"
            >
              Save Product
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label
                  labelText="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Cotton Hoodie"
                  size="xl"
                  classes="border-gray-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block" htmlFor="brand">Brand</label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="no brand">No Brand</option>
                  {getFilterValues("brand")?.length > 0 ? <>
                    {
                      getFilterValues("brand")?.map((b) => (
                        <option value={b}>{capitalizeFirstLetter(b)}</option>
                      ))
                    }
                  </> : ""}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Category</option>
                  {allCategories?.length > 0 && allCategories?.map((category) => (
                    <option key={category?._id} value={category?._id}>
                      {category?.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Selected Category ID: {formData.categoryId || "-"}
                </p>
              </div>

              <div>
                <Input
                  label
                  labelText="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. HD-PRM-001"
                  size="xl"
                  classes="border-gray-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Featured Product</label>
                <select
                  name="isFeatured"
                  value={formData.isFeatured}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  label
                  labelText="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  size="xl"
                  classes="border-gray-300"
                />
              </div>

              <div>
                <Input
                  type="number"
                  label
                  labelText="Old Price"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  size="xl"
                  classes="border-gray-300"
                />
              </div>

              <div>
                <Input
                  type="number"
                  label
                  labelText="Stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  size="xl"
                  classes="border-gray-300"
                />
              </div>

              <div>
                <Input
                  type="number"
                  label
                  labelText="Shipping Price"
                  name="shippingPrice"
                  value={formData.shippingPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  size="xl"
                  classes="border-gray-300"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Return Policy</label>
                <select
                  name="returned"
                  value={formData.returned}
                  onChange={handleChange}
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

          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Descriptions</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Short Description</label>
                <QuillEditor setValue={setshortDesc} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Long Description</label>
                <QuillEditor setValue={setlongDesc} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">Product Specifications</h4>
                  <button
                    type="button"
                    onClick={() => addSpec()}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <FaPlus size={11} /> Add Specification
                  </button>
                </div>
                <div className="space-y-3">
                  {moreSpecification?.map((spec, i) => (
                    <div key={`spec-${i}`} className="flex items-center flex-wrap gap-2">
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
          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Media Upload</h2>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-2 block">Main View Image</span>
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center bg-blue-50/70">
                  <FaCloudUploadAlt size={24} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-sm text-gray-700 font-medium">Upload main product image</p>
                  <p className="text-xs text-gray-500 mt-1">Single image for listing card</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="mt-3 block w-full text-sm text-gray-500"
                  />

                  {mainImage && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600 text-left mb-2">Preview</p>
                      <div className="relative w-24 h-24 rounded-lg border border-blue-200 overflow-hidden bg-white">
                        <img
                          src={mainImage.preview}
                          alt={mainImage.file?.name || "Main preview"}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeMainImage}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-2 block">Gallery Images</span>
                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center bg-emerald-50/70">
                  <FaCloudUploadAlt size={24} className="mx-auto text-emerald-600 mb-2" />
                  <p className="text-sm text-gray-700 font-medium">Upload up to 16 images</p>
                  <p className="text-xs text-gray-500 mt-1">Product detail gallery photos</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="mt-3 block w-full text-sm text-gray-500"
                  />

                  {galleryImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600 text-left mb-2">
                        Preview ({galleryImages.length}/16)
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {galleryImages.map((image) => (
                          <div
                            key={image.id}
                            className="relative w-full aspect-square rounded-lg border border-emerald-200 overflow-hidden bg-white"
                          >
                            <img
                              src={image.preview}
                              alt={image.file?.name || "Gallery preview"}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(image.id)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Variants & Meta</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  label
                  labelText="Tags"
                  name="tags"
                  value={formData.tags}
                  onChange={(e) => handleChangeTags(e.target.value)}
                  placeholder="Type Tags comma separated"
                  size="xl"
                  classes="border-gray-300"
                />
                <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                  {formData.tags?.map((t, i) => (
                    <span key={i} className="bg-blue-500 text-white px-2 py-1 text-sm rounded-md font-semibold">{capitalizeFirstLetter(t)}</span>
                  ))}
                </div>
              </div>

              <div>
                {getFilterValues("size")?.length > 0 ?
                  <>
                    <p>Select Sizes</p>
                    {getFilterValues("size").map((s, i) => (
                      <div key={i} className="flex items-center gap-2 font-semibold">
                        <input
                          type="checkbox"
                          name="size"
                          id={`size-${s}`}
                          value={s}
                          checked={formData.size.includes(s)}
                          onChange={(e) => handleChangeFilters(e, "size")}
                        />
                        <label htmlFor={`size-${s}`}>{s}</label>
                      </div>
                    ))}
                  </>
                  : ""}
              </div>

              <div>
                {getFilterValues("color")?.length > 0 ?
                  <>
                    <p>Select Colors</p>
                    {getFilterValues("color").map((c, i) => (
                      <div key={i} className="flex items-center gap-2 font-semibold">
                        <input
                          type="checkbox"
                          name="color"
                          id={`color-${c}`}
                          value={c}
                          checked={formData.color.includes(c)}
                          onChange={(e) => handleChangeFilters(e, "color")}
                        />
                        <label htmlFor={`color-${c}`}>{c}</label>
                      </div>
                    ))}
                  </>
                  : ""}
              </div>

              <div>
                {removeFilters(["color", "size", "brand"])?.length > 0 && <div>
                  {removeFilters(["color", "size", "brand"])?.map((filter, i) => {
                    return <div key={i} className="mb-2">
                      <p>Select {filter?.name[0].toUpperCase() + filter?.name?.slice(1)}</p>
                      {getFilterValues(filter?.name).map((c, index) => (
                        <div key={index} className="flex items-center gap-2 font-semibold">
                          <input
                            type="checkbox"
                            name="color"
                            id={`color-${c}`}
                            value={c}
                            checked={getSpecChecked(filter?.name, c)}
                            onChange={(e) => handleChangeFilters(e, filter?.name)}
                          />
                          <label htmlFor={`color-${c}`}>{c}</label>
                        </div>
                      ))}
                    </div>
                  })}
                </div>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
