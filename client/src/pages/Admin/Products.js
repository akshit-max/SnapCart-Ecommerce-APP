import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { formatPrice, photoUrl } from "../../utils/helpers";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/v1/product/get-product")
      .then(({ data }) => setProducts(data.products))
      .catch(() => toast.error("Could not load products"));
  }, []);

  return (
    <DashboardLayout title="Products" admin>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="page-title mb-0">Products ({products.length})</h4>
        <Link to="/dashboard/admin/create-product" className="btn btn-brand btn-sm">
          + Add Product
        </Link>
      </div>

      <div className="card-box p-0 table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img src={photoUrl(p._id)} alt={p.name} width={44} height={44}
                      className="rounded" style={{ objectFit: "cover" }} loading="lazy" />
                    {p.name}
                  </div>
                </td>
                <td>{p.category?.name}</td>
                <td>{formatPrice(p.price)}</td>
                <td className={p.quantity <= 5 ? "text-danger fw-semibold" : ""}>{p.quantity}</td>
                <td>
                  <Link to={`/dashboard/admin/product/${p.slug}`} className="btn btn-sm btn-outline-primary">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Products;
