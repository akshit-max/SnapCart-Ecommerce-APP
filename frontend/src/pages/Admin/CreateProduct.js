import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import ProductForm from "../../components/Form/ProductForm";
import { getErrorMessage } from "../../utils/helpers";

const CreateProduct = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await axios.post("/api/v1/product/create-product", formData);
      toast.success("Product published to catalog successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout title="Add New Product - SnapCart" admin>
      <div className="card-box p-4" style={{ maxWidth: 700 }}>
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <h4 className="fw-bold text-dark mb-1">Add New Product</h4>
            <p className="text-muted small mb-0">Publish a new apparel, electronic, or lifestyle item to your store.</p>
          </div>
          <Link to="/dashboard/admin/products" className="btn btn-outline-custom btn-sm">
            <FiArrowLeft className="me-1" /> Back to Inventory
          </Link>
        </div>

        <ProductForm submitLabel="Publish Product" onSubmit={handleCreate} />
      </div>
    </DashboardLayout>
  );
};

export default CreateProduct;
