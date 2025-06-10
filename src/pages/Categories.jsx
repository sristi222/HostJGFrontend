"use client"

import { useState, useEffect } from "react"
import { Table, LayoutGrid, Search, Plus, Edit, Trash2, X } from "lucide-react"
import "./Categories.css"

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newSubcategory, setNewSubcategory] = useState({ name: "", categoryId: null })
  const [editCategory, setEditCategory] = useState({ id: null, name: "", description: "", status: "active" })
  const [viewMode, setViewMode] = useState("table") // table or cards
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Failed to load categories")
      const data = await res.json()
      setCategories(data.sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err) {
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!showEditForm) {
      setEditCategory({ id: null, name: "", description: "", status: "active" })
    }
  }, [showEditForm])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      })
      const created = await res.json()
      setCategories([...categories, created].sort((a, b) => a.name.localeCompare(b.name)))
      setNewCategory({ name: "", description: "" })
      setShowAddForm(false)
    } catch (err) {
      console.error("Error adding category:", err)
    }
  }

  const handleEditCategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory),
      })
      const updated = await res.json()
      setCategories(
        categories.map((c) => (c._id === updated._id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name)),
      )
      setShowEditForm(false)
    } catch (err) {
      console.error("Error editing category:", err)
    }
  }

  const handleAddSubcategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/categories/${newSubcategory.categoryId}/subcategories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubcategory.name }),
      })
      const updated = await res.json()
      setCategories(
        categories.map((c) => (c._id === updated._id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name)),
      )
      setNewSubcategory({ name: "", categoryId: null })
      setShowSubcategoryForm(false)
    } catch (err) {
      console.error("Error adding subcategory:", err)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" })
      setCategories(categories.filter((c) => c._id !== id))
    } catch (err) {
      console.error("Error deleting category:", err)
    }
  }

  const handleDeleteSubcategory = async (categoryId, subcategoryId, subcategoryName) => {
    if (!window.confirm(`Delete subcategory "${subcategoryName}"?`)) return
    try {
      await fetch(`/api/categories/${categoryId}/subcategories/${subcategoryId}`, { method: "DELETE" })
      fetchCategories()
    } catch (err) {
      console.error("Error deleting subcategory:", err)
    }
  }

  const openEditModal = (category) => {
    setEditCategory({
      id: category._id,
      name: category.name,
      description: category.description,
      status: category.status,
    })
    setShowEditForm(true)
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const CategoryCard = ({ category }) => (
    <div className="category-card">
      <div className="category-card-header">
        <div className="category-card-title">
          <h3>{category.name}</h3>
          <span className={`status-badge ${category.status}`}>
            {category.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="category-card-actions">
          <button className="edit-btn" onClick={() => openEditModal(category)} title="Edit category">
            <Edit size={16} />
          </button>
          <button className="delete-btn" onClick={() => handleDeleteCategory(category._id)} title="Delete category">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {category.description && (
        <div className="category-card-description">
          <p>{category.description}</p>
        </div>
      )}

      <div className="category-card-subcategories">
        <div className="subcategories-header">
          <span className="subcategories-label">Subcategories ({(category.subcategories || []).length})</span>
          <button
            className="add-subcategory-btn-card"
            onClick={() => {
              setNewSubcategory({ name: "", categoryId: category._id })
              setShowSubcategoryForm(true)
            }}
            title="Add subcategory"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </div>
        <div className="subcategories-list-card">
          {(category.subcategories || []).map((subcategory) => (
            <div className="subcategory-tag-card" key={subcategory._id}>
              <span>{subcategory.name}</span>
              <button
                className="delete-subcategory-card"
                onClick={() => handleDeleteSubcategory(category._id, subcategory._id, subcategory.name)}
                title="Delete subcategory"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {(category.subcategories || []).length === 0 && <p className="no-subcategories">No subcategories yet</p>}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="categories-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div className="header-top">
          <h2>Category Management</h2>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <Table size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
              title="Card view"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>

        <div className="header-controls">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="category-actions">
            <button className="add-category-btn" onClick={() => setShowAddForm(true)}>
              <Plus size={18} className="btn-icon" />
              <span className="btn-text">Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Subcategories</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td className="name-cell">
                      <span className="category-name">{category.name}</span>
                    </td>
                    <td className="description-cell">
                      <span className="category-description">{category.description || "—"}</span>
                    </td>
                    <td className="subcategories-cell">
                      <div className="subcategories-list">
                        {(category.subcategories || []).map((subcategory) => (
                          <div className="subcategory-tag" key={subcategory._id}>
                            <span>{subcategory.name}</span>
                            <button
                              className="delete-subcategory"
                              onClick={() => handleDeleteSubcategory(category._id, subcategory._id, subcategory.name)}
                              title="Delete subcategory"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <button
                          className="add-subcategory-inline"
                          onClick={() => {
                            setNewSubcategory({ name: "", categoryId: category._id })
                            setShowSubcategoryForm(true)
                          }}
                          title="Add subcategory"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${category.status}`}>
                        {category.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => openEditModal(category)} title="Edit category">
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteCategory(category._id)}
                          title="Delete category"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="cards-container">
          {filteredCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}

      {filteredCategories.length === 0 && (
        <div className="no-categories">
          <div className="no-categories-icon">📁</div>
          <h3>No categories found</h3>
          <p>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Add your first category to get started organizing your products."}
          </p>
          <button className="add-first-category-btn" onClick={() => setShowAddForm(true)}>
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddForm(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Category</h3>
              <button className="close-modal" onClick={() => setShowAddForm(false)} title="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="categoryName">Category Name*</label>
                  <input
                    type="text"
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="categoryDescription">Description</label>
                  <textarea
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    rows={3}
                    placeholder="Optional description for this category"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEditForm(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Category</h3>
              <button className="close-modal" onClick={() => setShowEditForm(false)} title="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="editCategoryName">Category Name*</label>
                  <input
                    type="text"
                    id="editCategoryName"
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editCategoryDescription">Description</label>
                  <textarea
                    id="editCategoryDescription"
                    value={editCategory.description}
                    onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editCategoryStatus">Status</label>
                  <select
                    id="editCategoryStatus"
                    value={editCategory.status}
                    onChange={(e) => setEditCategory({ ...editCategory, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowEditForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Edit size={16} />
                  <span>Update Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showSubcategoryForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSubcategoryForm(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Subcategory</h3>
              <button className="close-modal" onClick={() => setShowSubcategoryForm(false)} title="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubcategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="subcategoryName">Subcategory Name*</label>
                  <input
                    type="text"
                    id="subcategoryName"
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowSubcategoryForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Plus size={16} />
                  <span>Add Subcategory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
