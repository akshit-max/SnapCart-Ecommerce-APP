import { useState } from "react";
import { FiUploadCloud, FiImage, FiCheck, FiDollarSign, FiBox } from "react-icons/fi";
import useCategory from "../../hooks/useCategory";
import { photoUrl } from "../../utils/helpers";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
  shipping: false,
};

// shared by Create Product and Update Product
const ProductForm = ({ initialValues = emptyProduct, productId, submitLabel, onSubmit }) => {
  const categories = useCategory();
  const [values, setValues] = useState(initialValues);
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    if (photo) formData.append("photo", photo);

    setSaving(true);
    await onSubmit(formData);
    setSaving(false);
  };

  // new photo preview, otherwise the saved one when editing
  const preview = photo ? URL.createObjectURL(photo) : productId ? photoUrl(productId) : null;

  return (
    <form onSubmit={handleSubmit}>
      {/* Category Selection */}
      <div className="mb-3">
        <label className="form-label small">Target Category</label>
        <select
          name="category"
          value={values.category}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Select a product category...</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload Dropzone */}
      <div className="mb-3">
        <label className="form-label small">Product High-Resolution Photo</label>
        <label
          className="d-flex flex-column align-items-center justify-content-center p-4 border border-dashed rounded-3 w-100 cursor-pointer"
          style={{
            cursor: "pointer",
            background: "#f8fafc",
            borderColor: "#cbd5e1",
            transition: "all 0.2s ease",
          }}
        >
          <FiUploadCloud size={32} className="text-primary mb-2" />
          <div className="fw-semibold text-dark small">
            {photo ? photo.name : "Click to select or drop product image (Max 1MB)"}
          </div>
          <span className="small text-muted" style={{ fontSize: "11px" }}>
            JPEG, PNG, or WebP. Automatically optimized & hosted on Cloudinary CDN.
          </span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </label>
      </div>

      {/* Preview Box */}
      {preview && (
        <div className="mb-3 p-2 bg-light border rounded-3 text-center">
          <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
            <FiImage size={13} /> Active Image Preview:
          </div>
          <img
            src={preview}
            alt="Preview"
            className="rounded border"
            style={{ maxHeight: 220, maxWidth: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Name Input */}
      <div className="mb-3">
        <label className="form-label small">Product Title</label>
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g. Italian Wool Tailored Blazer (Charcoal)"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label small">Product Story & Specifications</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          className="form-control"
          rows={4}
          placeholder="Detailed product highlights, material composition, sizing instructions..."
          required
        />
      </div>

      {/* Pricing and Stock */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label className="form-label small d-flex align-items-center gap-1">
            <FiDollarSign size={13} className="text-muted" /> Retail Price (₹ INR)
          </label>
          <input
            type="number"
            name="price"
            min="1"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            className="form-control"
            placeholder="2999"
            required
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label small d-flex align-items-center gap-1">
            <FiBox size={13} className="text-muted" /> Initial Stock Units
          </label>
          <input
            type="number"
            name="quantity"
            min="0"
            value={values.quantity}
            onChange={handleChange}
            className="form-control"
            placeholder="50"
            required
          />
        </div>
      </div>

      {/* Shipping Checkbox */}
      <div className="form-check p-3 bg-light rounded-3 border mb-4">
        <input
          type="checkbox"
          id="shipping"
          className="form-check-input ms-0 me-2"
          checked={values.shipping}
          onChange={(e) => setValues({ ...values, shipping: e.target.checked })}
        />
        <label htmlFor="shipping" className="form-check-label fw-semibold text-dark small cursor-pointer">
          Include Complimentary Express Shipping for this product
        </label>
      </div>

      <button type="submit" className="btn btn-brand w-100 py-2" disabled={saving}>
        {saving ? "Saving to Catalog..." : <><FiCheck className="me-1" /> {submitLabel}</>}
      </button>
    </form>
  );
};

export default ProductForm;
