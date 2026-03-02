import React, { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaLayerGroup,
  FaPlus,
  FaSearch,
  FaSitemap,
  FaTag,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux'
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory, updateCategoryStatus } from '../../../store/adminSlices/CategorySlice';
import { Pagination, Input } from "../../../components";
import { LuPencil } from "react-icons/lu";
import { toast } from "react-toastify";

const FILTER_TYPES = ["checkbox", "radio", "btn"];

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

const emptyFilter = () => ({ name: "", values: [], type: "btn" });

function Categories() {
  const { categories, totalPages, totalCategories, parentCategories, subCategories,totalCategoriesStats } = useSelector((state) => state.categoryAdminSlice);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(20);

  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [handleChanged, sethandleChanged] = useState(false);
  const [filterStatus, setfilterStatus] = useState("all");

  const [createForm, setCreateForm] = useState({
    name: "",
    parent: "",
    image: {
      file: null,
      preview: ""
    }
  });
  const [editForm, setEditForm] = useState({
    name: "",
    parent: "",
    image: {
      file: null,
      preview: ""
    }
  });

  const [filters, setfilters] = useState([emptyFilter()])

  const parentOptions = useMemo(
    () => categories.filter((c) => !c.parent).map((c) => ({ id: c._id, name: c.name })),
    [categories]
  );

  const stats = [
    { id: 1, title: "Total Categories", value: totalCategoriesStats, icon: FaLayerGroup, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 2, title: "Parent Categories", value: parentCategories, icon: FaSitemap, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: 3, title: "Sub Categories", value: subCategories, icon: FaTag, color: "text-violet-600", bg: "bg-violet-50" }
  ];

  useEffect(() => {
    return () => {
      if (createForm?.image?.preview?.startsWith("blob:")) URL.revokeObjectURL(createForm?.image?.preview);

      if (editForm?.image?.preview?.startsWith("blob:")) URL.revokeObjectURL(editForm?.image?.preview);
    };
  }, [createForm.image?.preview, editForm.image?.preview]);

  const resetCreateForm = () => {
    if (createForm.image?.preview?.startsWith("blob:")) URL.revokeObjectURL(createForm.image.preview);

    setCreateForm({
      name: "",
      parent: "",
      image: {
        file: null,
        preview: ""
      }
    });
    setfilters([emptyFilter()])
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (createForm.image?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(createForm?.image?.preview);
    }

    setCreateForm((prev) => ({
      ...prev,
      image: {
        file,
        preview: URL.createObjectURL(file)
      }
    }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (editForm?.image?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(editForm?.image.preview);
    }

    setEditForm((prev) => ({
      ...prev,
      image: {
        file,
        preview: URL.createObjectURL(file)
      }
    }));
  };

  const handleFilterNameChange = (index, value) => {
    let newFilters = [...filters];
    newFilters[index].name = value.toLowerCase();
    setfilters(newFilters)
  };

  const handleFilterValuesChange = (index, value) => {
    let newFilters = [...filters];
    let values = value?.split(",")?.map((f, i) => String(f).trim().toLowerCase());

    newFilters[index].values = values;
    setfilters(newFilters)
  };

  const handleFilterTypeChange = (index, value) => {
    let newFilters = [...filters];
    newFilters[index].type = value.toLowerCase();
    setfilters(newFilters)
  };

  const addFilterRow = () => {
    setfilters((prev) => ([...prev, emptyFilter()]));
  };

  const removeFilterRow = (index) => {
    setfilters((prev) => prev.filter((_, i) => i !== index));
  };

  const openView = async (categoryId) => {
    await dispatch(getCategory(categoryId))
      .then((res) => {
        if (res.type == "getcategory/fulfilled") {
          setSelectedCategory(res.payload.data);
          setViewModal(true);
        }
      }).catch((err) => {
        console.log(err);
      })
  };

  const openEdit = async (categoryId) => {
    setSelectedCategory(categoryId);
    await dispatch(getCategory(categoryId))
      .then((res) => {
        if (res.type == "getcategory/fulfilled") {
          let data = res.payload.data;

          if (editForm?.image?.preview?.startsWith("blob:")) URL.revokeObjectURL(editForm?.image?.preview);

          setEditForm({
            name: data?.name,
            parent: data?.parent?._id,
            image: {
              file: null,
              preview: data?.image?.url
            }
          });

          setfilters(data?.filters?.length > 0 ? data?.filters : []);

          setEditModal(true);
        }
      }).catch((err) => {
        console.log(err);
      })
  };

  const openDelete = (category) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const closeModals = () => {
    setCreateModal(false);
    setViewModal(false);
    setEditModal(false);
    setDeleteModal(false);
    setSelectedCategory(null);
  };

  const handleCreateCategory = async () => {
    if (!createForm.name.trim()) {
      toast.success("Please enter category name");
      return;
    };

    const formData = new FormData();
    formData.append("name", createForm.name);
    formData.append("parent", createForm.parent);
    formData.append("filters", JSON.stringify(filters))

    formData.append("image", createForm.image?.file);

    await dispatch(createCategory({ formData }))
      .then((res) => {
        if (res.type == "createcategory/fulfilled") {
          toast.success(res.payload?.message);
          resetCreateForm();
          setCreateModal(false);
          sethandleChanged(!handleChanged);
        } else {
          toast.error(res.payload?.message)
        }
      }).catch((err) => {
        console.log(err);
      })
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("filters", JSON.stringify(filters))
    formData.append("parent", editForm.parent);

    if (editForm.image.file) {
      formData.append("image", editForm.image?.file);
    }

    await dispatch(updateCategory({ categoryId: selectedCategory, categoryData: formData }))
      .then((res) => {
        if (res.type == "updatecategory/fulfilled") {
          toast.success(res.payload?.message);
          setEditModal(false);
          setSelectedCategory(null);
          sethandleChanged(!handleChanged);
        } else {
          toast.error(res.payload?.message)
        }
      }).catch((err) => {
        console.log(err);
      })
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    await dispatch(deleteCategory(selectedCategory))
      .then((res) => {
        if (res.type == "deletecategory/fulfilled") {
          toast.success(res.payload?.message);
          sethandleChanged(!handleChanged)
        }
      })
      .catch((err) => {
        console.log(err);
      })

    closeModals();
  };

  const handleUpdateCategoryStatus = async (categoryId, status) => {
    await dispatch(updateCategoryStatus({ categoryId, status }))
      .then((res) => {
        if (res.type == "updatecategorystatus/fulfilled") {
          toast.success(res.payload?.message);
          sethandleChanged(!handleChanged)
        } else {
          toast.error(res.payload?.message)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  };

  useEffect(() => {
    dispatch(getCategories({ page, limit, search, status: filterStatus }));
  }, [search, page, handleChanged, filterStatus])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-lg">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold">Categories Management</h3>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative min-w-56">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search name/slug..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setfilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
            <button
              type="button"
              onClick={() => setCreateModal(true)}
              className="px-4 py-2 bg-btn2 text-text rounded-lg hover:bg-hover-btn2 flex items-center justify-center gap-2 min-w-44"
            >
              <FaPlus size={13} /> Create Category
            </button>
          </div>
        </div>

        <div className="overflow-x-auto block overflow-hidden">
          <table className="w-full min-w-220">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Category</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Parent</th>
                <th className="text-left px-2 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-center px-2 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="border-b border-gray-200">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <img src={category.image?.url} alt={category.name} className="w-10 h-10 rounded object-cover" />
                        <p className="font-semibold text-gray-800">{category?.name}</p>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-700">{category?.parent_info?.name}</td>
                    <td className="px-2 py-3">
                      <select
                        value={category.actionStatus}
                        onChange={(e) => handleUpdateCategoryStatus(category._id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm font-medium  focus:outline-none`}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspend</option>
                        <option value="deleted">Delete</option>
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => openView(category?._id)}>
                          <FaEye size={15} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" onClick={() => openEdit(category?._id)}>
                          <FaEdit size={15} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => openDelete(category)}>
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination...... */}
        <Pagination NumberOfItems={totalCategories} limit={limit} page={page} setpage={setpage} totalPages={totalPages} title="Categories" />
      </div>

      {createModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-40 bg-white p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Create Category</h2>
              <button onClick={() => { closeModals(); resetCreateForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label
                    labelText="Category Name"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateChange}
                    placeholder="e.g. Shoes"
                    size="xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Parent</label>
                  <select name="parent" value={createForm.parent} onChange={handleCreateChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">No Parent</option>
                    {parentOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category Image</label>
                  <input type="file" accept="image/*" onChange={handleCreateImageChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" />
                  {createForm.image.preview && (
                    <img src={createForm.image.preview} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-gray-200 mt-3" />
                  )}
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">Filters</h4>
                  <button
                    type="button"
                    onClick={() => addFilterRow()}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <FaPlus size={11} /> Add Filter
                  </button>
                </div>

                <div className="space-y-3">
                  {filters?.map((filter, i) => (
                    <div key={`create-filter-${i}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <input
                        type="text"
                        value={filter.name}
                        onChange={(e) => handleFilterNameChange(i, e.target.value)}
                        placeholder="Filter Name"
                        className="md:col-span-3 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={filter?.values}
                        onChange={(e) => handleFilterValuesChange(i, e.target.value)}
                        placeholder="Values: Black, White"
                        className="md:col-span-6 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={filter.type}
                        onChange={(e) => handleFilterTypeChange(i, e.target.value)}
                        className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {FILTER_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeFilterRow(i)}
                        className="md:col-span-1 flex items-center justify-center px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { closeModals(); resetCreateForm(); }} className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
                <button type="button" onClick={handleCreateCategory} className="flex-1 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold">Create Category</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-40 p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Category Details</h2>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <img src={selectedCategory.image?.url} alt={selectedCategory?.name} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedCategory?.name}</h3>
                  <p className="text-sm text-gray-500">Slug: {selectedCategory?.slug}</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">{selectedCategory?._id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Parent Category</p>
                  <p className="font-semibold text-gray-800">{selectedCategory?.parent?.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedCategory.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Updated</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedCategory.updatedAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedCategory?.actionStatus}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3">Filters</h4>
                {selectedCategory?.filters?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCategory.filters.map((filter, idx) => (
                      <div key={`${filter.name}-${idx}`} className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-gray-800">{filter?.name}</p>
                        <p className="text-xs text-gray-500">Type: {filter?.type}</p>
                        <p className="text-sm text-gray-700 mt-1">{filter?.values.join(", ") || "-"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No filters configured.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-40 p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Update Category</h2>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label
                    labelText="Category Name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="e.g. Shoes"
                    size="xl"
                    type="text"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Parent</label>
                  <select name="parent" value={editForm.parent} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select Parent Category</option>
                    {parentOptions.filter((p) => p.id !== selectedCategory).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-1.5 block">Category Image</h3>
                  <div className="flex items-center w-30 h-30 relative border-gray-300 border rounded-lg mt-2">
                    <label className="w-full h-full" htmlFor="image">
                      <input type="file" id="image" accept="image/*" onChange={handleEditImageChange} className="w-full hidden border border-gray-300 rounded-lg px-3 py-2.5" />
                      <div className="absolute -top-2 -right-2 bg-gray-500 p-1.5 w-7 h-7 text-white rounded-full flex items-center justify-center">
                        <LuPencil size={18} />
                      </div>
                      {editForm?.image?.preview && (
                        <img src={editForm?.image.preview} alt="Preview" className="w-full h-full rounded-lg object-cover" />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">Filters</h4>
                  <button
                    type="button"
                    onClick={() => addFilterRow("edit")}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <FaPlus size={11} /> Add Filter
                  </button>
                </div>

                <div className="space-y-3">
                  {filters?.map((filter, i) => (
                    <div key={`edit-filter-${i}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <input
                        type="text"
                        value={filter?.name}
                        onChange={(e) => handleFilterNameChange(i, e.target.value)}
                        placeholder="Filter Name"
                        className="md:col-span-3 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={filter?.values}
                        onChange={(e) => handleFilterValuesChange(i, e.target.value)}
                        placeholder="Values: Black, White"
                        className="md:col-span-6 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={filter.type}
                        onChange={(e) => handleFilterTypeChange(i, e.target.value)}
                        className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {FILTER_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeFilterRow(i)}
                        className="md:col-span-1 px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModals} className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
                <button type="button" onClick={handleEditCategory} className="flex-1 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Category</h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-semibold">{selectedCategory?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={closeModals} className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>
              <button type="button" onClick={handleDeleteCategory} className="flex-1 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Categories;
