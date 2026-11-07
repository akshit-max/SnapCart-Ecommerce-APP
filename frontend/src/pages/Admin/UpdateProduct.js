import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2, FiArrowLeft, FiExternalLink } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import ProductForm from "../../components/Form/ProductForm";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/helpers";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      toast.success("Product updated successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/v1/product/delete-product/${product._id}`);
      toast.success("Product permanently deleted");
      setShowDeleteModal(false);
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DashboardLayout title="Edit Product - SnapCart" admin>
      <div className="card-box p-4" style={{ maxWidth: 700 }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h4 className="fw-bold text-dark mb-0">Edit Product</h4>
              {product && (
                <Link
                  to={`/product/${product.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-custom p-1 px-2"
                  title="View on Storefront"
                >
                  <FiExternalLink size={13} />
                </Link>
              )}
            </div>
            <p className="text-muted small mb-0">Modify specifications, pricing, imagery, or inventory.</p>
          </div>

          <div className="d-flex gap-2">
            <Link to="/dashboard/admin/products" className="btn btn-outline-custom btn-sm">
              <FiArrowLeft className="me-1" /> Inventory
            </Link>
            {product && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => setShowDeleteModal(true)}>
                <FiTrash2 className="me-1" /> Delete
              </button>
            )}
          </div>
        </div>

        {!product ? (
          <div className="py-5">
            <Spinner />
          </div>
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

      {/* In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Product?"
        message={`Are you sure you want to permanently delete "${product?.name}"? Its Cloudinary CDN image will be deleted and this product will no longer appear on the storefront.`}
        confirmText="Permanently Delete"
        cancelText="Keep Product"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </DashboardLayout>
  );
};

export default UpdateProduct;
