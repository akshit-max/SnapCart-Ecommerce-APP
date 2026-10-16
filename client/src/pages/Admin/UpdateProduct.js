import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import ProductForm from "../../components/Form/ProductForm";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/helpers";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/v1/product/get-product/${slug}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => {
        toast.error("Product not found");
        navigate("/dashboard/admin/products");
      });
  }, [slug, navigate]);

  const handleUpdate = async (formData) => {
    try {
      await axios.put(`/api/v1/product/update-product/${product._id}`, formData);
      toast.success("Product updated");
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await axios.delete(`/api/v1/product/delete-product/${product._id}`);
      toast.success("Product deleted");
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout title="Edit Product" admin>
      <div className="card-box" style={{ maxWidth: 650 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="page-title mb-0">Edit Product</h4>
          {product && (
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>

        {!product ? (
          <Spinner />
        ) : (
          <ProductForm
            productId={product._id}
            initialValues={{
              name: product.name,
              description: product.description,
              price: product.price,
              quantity: product.quantity,
              category: product.category?._id || "",
              shipping: Boolean(product.shipping),
            }}
            submitLabel="Save Changes"
            onSubmit={handleUpdate}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UpdateProduct;
