import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal } from "antd";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CategoryForm from "../../components/Form/CategoryForm";
import { getErrorMessage } from "../../utils/helpers";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      setCategories(data.category);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/v1/category/create-category", { name });
      toast.success(`${name} created`);
      setName("");
      getAllCategory();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updatedName });
      toast.success("Category updated");
      setSelected(null);
      getAllCategory();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    try {
      await axios.delete(`/api/v1/category/delete-category/${category._id}`);
      toast.success("Category deleted");
      getAllCategory();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout title="Categories" admin>
      <h4 className="page-title mb-4">Manage Categories</h4>

      <div className="card-box mb-4" style={{ maxWidth: 500 }}>
        <h6 className="fw-semibold mb-3">Add new category</h6>
        <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
      </div>

      <div className="card-box p-0 table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td className="fw-medium">{c.name}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setSelected(c);
                      setUpdatedName(c.name);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(selected)} onCancel={() => setSelected(null)} footer={null} title="Edit Category">
        <CategoryForm
          value={updatedName}
          setValue={setUpdatedName}
          handleSubmit={handleUpdate}
          buttonText="Save"
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateCategory;
