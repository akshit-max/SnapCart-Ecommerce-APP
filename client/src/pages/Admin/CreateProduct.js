import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import ProductForm from "../../components/Form/ProductForm";
import { getErrorMessage } from "../../utils/helpers";

const CreateProduct = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await axios.post("/api/v1/product/create-product", formData);
      toast.success("Product created");
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout title="Add Product" admin>
      <div className="card-box" style={{ maxWidth: 650 }}>
        <h4 className="page-title mb-4">Add New Product</h4>
        <ProductForm submitLabel="Create Product" onSubmit={handleCreate} />
      </div>
    </DashboardLayout>
  );
};

export default CreateProduct;
