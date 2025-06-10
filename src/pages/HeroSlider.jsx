"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./HeroSlider.css"

function HeroSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSlide, setNewSlide] = useState({
    title: "",
    subtitle: "",
    image: null,
    imagePreview: null,
    active: true,
  })
  const [editingSlide, setEditingSlide] = useState(null)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hero-slides")
        if (res.data.success) {
          setSlides(res.data.slides)
        }
      } catch (err) {
        console.error("Error fetching slides:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSlides()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      const updated = editingSlide
        ? { ...editingSlide, image: file, imagePreview: previewUrl }
        : { ...newSlide, image: file, imagePreview: previewUrl }
      editingSlide ? setEditingSlide(updated) : setNewSlide(updated)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const inputVal = type === "checkbox" ? checked : value
    editingSlide
      ? setEditingSlide({ ...editingSlide, [name]: inputVal })
      : setNewSlide({ ...newSlide, [name]: inputVal })
  }

  const handleAddSlide = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.entries(newSlide).forEach(([key, val]) => {
        if (key !== "imagePreview") formData.append(key, val)
      })
      const res = await axios.post("http://localhost:5000/api/hero-slides", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (res.data.success) {
        setSlides((prev) => [...prev, res.data.slide])
        setShowAddForm(false)
      }
    } catch (err) {
      console.error("Failed to add slide:", err)
    }
  }

  const handleUpdateSlide = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.entries(editingSlide).forEach(([key, val]) => {
        if (key !== "imagePreview") formData.append(key, val)
      })
      const res = await axios.put(`http://localhost:5000/api/hero-slides/${editingSlide._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (res.data.success) {
        setSlides((prev) => prev.map((s) => (s._id === editingSlide._id ? res.data.slide : s)))
        setEditingSlide(null)
      }
    } catch (err) {
      console.error("Failed to update slide:", err)
    }
  }

  const handleDeleteSlide = async (id) => {
    if (!window.confirm("Delete this slide?")) return
    try {
      await axios.delete(`http://localhost:5000/api/hero-slides/${id}`)
      setSlides((prev) => prev.filter((s) => s._id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  const handleToggleActive = async (id) => {
    const target = slides.find((s) => s._id === id)
    const formData = new FormData()
    formData.append("title", target.title)
    formData.append("subtitle", target.subtitle || "")
    formData.append("active", (!target.active).toString())
    try {
      await axios.put(`http://localhost:5000/api/hero-slides/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setSlides((prev) => prev.map((s) => (s._id === id ? { ...s, active: !s.active } : s)))
    } catch (err) {
      console.error("Toggle active failed:", err)
    }
  }

  const handleReorder = async (id, direction) => {
    const idx = slides.findIndex((s) => s._id === id)
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === slides.length - 1)) return
    const newSlides = [...slides]
    const targetIdx = direction === "up" ? idx - 1 : idx + 1
    ;[newSlides[idx], newSlides[targetIdx]] = [newSlides[targetIdx], newSlides[idx]]
    const orderList = newSlides.map((s) => s._id)
    try {
      await axios.post("http://localhost:5000/api/hero-slides/reorder", { orderList })
      newSlides.forEach((s, i) => (s.order = i + 1))
      setSlides(newSlides)
    } catch (err) {
      console.error("Reorder failed:", err)
    }
  }

  if (loading) return <div className="loading-container">Loading hero slides...</div>

  return (
    <div className="hero-slider-page">
      <div className="hero-slider-header">
        <h2>Hero Slider Management</h2>
        <button className="add-slide-btn" onClick={() => setShowAddForm(true)}>
          Add New Slide
        </button>
      </div>

      {(showAddForm || editingSlide) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSlide ? "Edit Slide" : "Add New Slide"}</h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingSlide(null)
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={editingSlide ? handleUpdateSlide : handleAddSlide}>
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={editingSlide ? editingSlide.title : newSlide.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={editingSlide ? editingSlide.subtitle : newSlide.subtitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Image*</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingSlide}
                />
                <div
                  className="image-preview"
                  style={{
                    backgroundImage: `url(${editingSlide ? editingSlide.imagePreview || editingSlide.imageUrl : newSlide.imagePreview})`,
                  }}
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="active"
                    checked={editingSlide ? editingSlide.active : newSlide.active}
                    onChange={handleInputChange}
                  />{" "}
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingSlide(null)
                  }}
                >
                  Cancel
                </button>
                <button type="submit">{editingSlide ? "Update" : "Add"} Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="slides-container">
        {slides.length === 0 ? (
          <div className="no-slides">No slides found. Add your first slide!</div>
        ) : (
          slides.map((s) => (
            <div key={s._id} className={`slide-card ${!s.active ? "inactive" : ""}`}>
              <img src={s.imageUrl || "/placeholder.svg"} alt={s.title} />
              <div className="slide-details">
                <h3>{s.title}</h3>
                <p>{s.subtitle}</p>
                <p>
                  <strong>Order:</strong> {s.order}
                </p>
              </div>
              <div className="slide-actions">
                <button onClick={() => setEditingSlide({ ...s, imagePreview: null })}>Edit</button>
                <button onClick={() => handleToggleActive(s._id)}>{s.active ? "Deactivate" : "Activate"}</button>
                <button onClick={() => handleDeleteSlide(s._id)}>Delete</button>
                <button onClick={() => handleReorder(s._id, "up")}>↑</button>
                <button onClick={() => handleReorder(s._id, "down")}>↓</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HeroSlider
