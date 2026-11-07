import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal } from "antd";
import { FiFolder, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import CategoryForm from "../../components/Form/CategoryForm";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/helpers";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      setCategories(data.category);
    } catch (error) {
      toast.error("Error fetching categories");
    } finally {
      setLoading(false);
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

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await axios.delete(`/api/v1/category/delete-category/${categoryToDelete._id}`);
      toast.success("Category deleted");
      setCategoryToDelete(null);
      getAllCategory();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout title="Categories - SnapCart" admin>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Category Master ({categories.length})</h4>
          <p className="text-muted small mb-0">Create, rename, or retire product collections and departments.</p>
        </div>
        <div className="p-2 rounded-3 bg-primary-subtle text-primary">
          <FiFolder size={22} />
        </div>
      </div>

      <div className="card-box mb-4 p-4" style={{ maxWidth: 560 }}>
        <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
          <FiPlus className="text-primary" /> Create New Department
        </h6>
        <p className="text-muted small mb-3">Add a new category for products in your store catalog.</p>
        <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} buttonText="Create Department" />
      </div>

      {loading ? (
        <div className="py-5">
          <Spinner />
        </div>
      ) : (
        <div className="card-box p-0 table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Department Name</th>
                <th>URL Slug</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className="fw-bold text-dark d-flex align-items-center gap-2">
                      <FiFolder className="text-muted" size={15} /> {c.name}
                    </div>
                  </td>
                  <td>
                    <span className="small text-muted font-monospace" style={{ fontSize: "12px" }}>
                      /{c.slug}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-custom me-2"
                      onClick={() => {
                        setSelected(c);
                        setUpdatedName(c.name);
                      }}
                    >
                      <FiEdit2 className="me-1" /> Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setCategoryToDelete(c)}>
                      <FiTrash2 className="me-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        onCancel={() => setSelected(null)}
        footer={null}
        title="Edit Category"
        centered
      >
        <div className="pt-2">
          <CategoryForm
            value={updatedName}
            setValue={setUpdatedName}
            handleSubmit={handleUpdate}
            buttonText="Save Changes"
          />
        </div>
      </Modal>

      {/* In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        title="Delete Department?"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? Products currently assigned to this category will need to be reassigned.`}
        confirmText="Delete Department"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </DashboardLayout>
  );
};

export default CreateCategory;
