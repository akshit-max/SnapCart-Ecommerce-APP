import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
  }, []);

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`,
      );
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      setCategories(data?.category);
    } catch (error) {
      toast.error("Error loading categories");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);

      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData,
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this product?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Product deleted");
      navigate("/dashboard/admin/products");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout title={"Update Product"}>
      <style>{`
        .page-wrapper {
          padding: 30px;
        }

        .form-card {
          background: #fff;
          border-radius: 16px;
          padding: 25px;
          border: 1px solid #e6efff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          max-width: 600px;
        }

        .form-title {
          font-weight: 600;
          margin-bottom: 20px;
          color: #1e293b;
        }

        .form-control {
          border-radius: 10px;
          border: 1px solid #dbeafe;
        }

        .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }

        .upload-btn {
          border-radius: 10px;
        }

        .product-img {
          border-radius: 12px;
          height: 200px;
          object-fit: cover;
        }

        .primary-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          border-radius: 10px;
        }

        .danger-btn {
          border-radius: 10px;
        }
      `}</style>

      <div className="container-fluid page-wrapper">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* MAIN */}
          <div className="col-md-9 d-flex justify-content-center">
            <div className="form-card">
              <h4 className="form-title">Update Product</h4>

              <Select
                placeholder="Select category"
                className="form-select mb-3"
                value={category}
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* IMAGE */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary w-100 upload-btn">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </label>
              </div>

              <div className="text-center mb-3">
                <img
                  src={
                    photo
                      ? URL.createObjectURL(photo)
                      : `/api/v1/product/product-photo/${id}`
                  }
                  alt="product"
                  className="product-img w-100"
                />
              </div>

              {/* INPUTS */}
              <input
                className="form-control mb-3"
                value={name}
                placeholder="Product name"
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className="form-control mb-3"
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="number"
                className="form-control mb-3"
                value={price}
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="number"
                className="form-control mb-3"
                value={quantity}
                placeholder="Quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Select
                className="form-select mb-3"
                value={shipping ? "1" : "0"}
                onChange={(value) => setShipping(value)}
              >
                <Option value="0">No Shipping</Option>
                <Option value="1">Shipping</Option>
              </Select>

              {/* BUTTONS */}
              <div className="d-flex gap-2">
                <button
                  className="btn text-white w-50 primary-btn"
                  onClick={handleUpdate}
                >
                  Update
                </button>

                <button
                  className="btn btn-danger w-50 danger-btn"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
