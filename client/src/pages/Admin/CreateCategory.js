import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // GET
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${id}`
      );
      if (data.success) {
        toast.success("Category deleted");
        getAllCategory();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid px-4 py-3" style={{ background: "#f4f7fb" }}>
        <div className="row">

          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-md-9">

            {/* Header */}
            <div className="mb-4">
              <h2 style={{ fontWeight: "600", color: "#1e293b" }}>
                Manage Categories
              </h2>
              <p style={{ color: "#64748b" }}>
                Create, update and manage product categories
              </p>
            </div>

            {/* Create Card */}
            <div
              className="p-4 mb-4"
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                maxWidth: "500px",
              }}
            >
              <h5 style={{ marginBottom: "15px", color: "#2563eb" }}>
                Add New Category
              </h5>

              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>

            {/* Table Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h5 style={{ marginBottom: "20px", color: "#2563eb" }}>
                All Categories
              </h5>

              <table className="table align-middle">
                <thead style={{ background: "#eff6ff" }}>
                  <tr>
                    <th style={{ color: "#1e3a8a" }}>Name</th>
                    <th style={{ color: "#1e3a8a" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: "500" }}>{c.name}</td>

                      <td>
                        <button
                          className="btn btn-sm me-2"
                          style={{
                            background: "#3b82f6",
                            color: "#fff",
                            borderRadius: "6px",
                          }}
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm"
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            borderRadius: "6px",
                          }}
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MODAL */}
            <Modal
              open={visible} // ✅ FIXED (antd v5)
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <h5 style={{ marginBottom: "15px", color: "#2563eb" }}>
                Update Category
              </h5>

              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;