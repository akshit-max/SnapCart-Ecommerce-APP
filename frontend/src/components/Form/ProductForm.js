import { useState } from "react";
import { FaImage } from "react-icons/fa";
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
      <label className="form-label small">Category</label>
      <select name="category" value={values.category} onChange={handleChange} className="form-select mb-3" required>
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <label className="btn btn-outline-secondary w-100 mb-3">
        <FaImage className="me-2" />
        {photo ? photo.name : "Upload photo (max 1mb)"}
        <input type="file" accept="image/*" hidden onChange={(e) => setPhoto(e.target.files[0])} />
      </label>

      {preview && (
        <img src={preview} alt="preview" className="w-100 mb-3 rounded" style={{ height: 220, objectFit: "contain" }} />
      )}

      <label className="form-label small">Name</label>
      <input name="name" value={values.name} onChange={handleChange} className="form-control mb-3" required />

      <label className="form-label small">Description</label>
      <textarea name="description" value={values.description} onChange={handleChange}
        className="form-control mb-3" rows={3} required />

      <div className="row">
        <div className="col-6">
          <label className="form-label small">Price (₹)</label>
          <input type="number" name="price" min="0.01" step="0.01" value={values.price}
            onChange={handleChange} className="form-control mb-3" required />
        </div>
        <div className="col-6">
          <label className="form-label small">Stock</label>
          <input type="number" name="quantity" min="0" value={values.quantity}
            onChange={handleChange} className="form-control mb-3" required />
        </div>
      </div>

      <div className="form-check mb-4">
        <input
          type="checkbox"
          id="shipping"
          className="form-check-input"
          checked={values.shipping}
          onChange={(e) => setValues({ ...values, shipping: e.target.checked })}
        />
        <label htmlFor="shipping" className="form-check-label">Free shipping</label>
      </div>

      <button type="submit" className="btn btn-brand w-100 py-2" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;
