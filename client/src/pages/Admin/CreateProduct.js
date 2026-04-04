import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const { data } = await axios.get("/api/v1/category/get-category");
        if (data?.success) setCategories(data?.category);
      } catch {
        toast.error("Error loading categories");
      }
    };
    getAllCategory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);

      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData
      );

      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Create Product"}>

      <style>{`
        .wrapper {
          padding: 30px;
        }

        .card-form {
          background: #fff;
          border-radius: 18px;
          padding: 28px;
          border: 1px solid #e6efff;
          box-shadow: 0 12px 30px rgba(0,0,0,0.05);
          max-width: 650px;
          width: 100%;
        }

        .title {
          font-weight: 600;
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .form-control {
          border-radius: 10px;
          border: 1px solid #dbeafe;
          padding: 10px;
        }

        .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }

        .upload-box {
          border: 2px dashed #dbeafe;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          width:100%;
        }

        .upload-box:hover {
          background: #f8fbff;
        }

        .upload-icon {
          font-size: 22px;
          color: #2563eb;
          margin-bottom: 5px;
        }

        .img-preview {
          border-radius: 12px;
          height: 200px;
          object-fit: cover;
        }

        .submit-btn {
          height: 45px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          font-weight: 500;
        }
      `}</style>

      <div className="container-fluid wrapper">
        <div className="row">

          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9 d-flex justify-content-center">

            <div className="card-form">

              <div className="title">Create New Product</div>

              {/* CATEGORY */}
              <Select
                placeholder="Select category"
                className="w-100 mb-3"
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* IMAGE UPLOAD */}
              <label className="upload-box mb-3 ">
                <FaImage className="upload-icon" />
                <div>{photo ? photo.name : "Click to upload image"}</div>

                <input
                  type="file"
                  hidden
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </label>

              {photo && (
                <div className="mb-3 text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="preview"
                    className="img-preview w-100"
                  />
                </div>
              )}

              {/* INPUTS */}
              <input
                className="form-control mb-3"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className="form-control mb-3"
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="row">
                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <Select
                className="w-100 mb-3"
                placeholder="Shipping"
                onChange={(value) => setShipping(value)}
              >
                <Option value="0">No Shipping</Option>
                <Option value="1">Shipping Available</Option>
              </Select>

              {/* BUTTON */}
              <button
                className="btn text-white w-100 submit-btn"
                onClick={handleCreate}
              >
                Create Product
              </button>

            </div>

          </div>
        </div>
      </div>

    </Layout>
  );
};

export default CreateProduct;