import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>

      <style>{`
        .orders-wrapper {
          padding: 30px;
        }

        .order-box {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e6efff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          padding: 15px;
          margin-bottom: 25px;
        }

        .table {
          margin-bottom: 10px;
        }

        .table thead {
          background: #f1f5ff;
        }

        .table th {
          font-size: 13px;
          color: #475569;
          border: none;
        }

        .table td {
          font-size: 13px;
          border-top: 1px solid #f1f5ff;
          vertical-align: middle;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          background: #e0edff;
          color: #2563eb;
        }

        .product-card {
          display: flex;
          gap: 15px;
          border-radius: 12px;
          border: 1px solid #f1f5ff;
          padding: 10px;
          margin-bottom: 10px;
          background: #fafcff;
          transition: all 0.2s ease;
        }

        .product-card:hover {
          background: #f1f5ff;
        }

        .product-card img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 8px;
        }

        .product-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }

        .product-desc {
          font-size: 12px;
          color: #64748b;
        }

        .price {
          font-size: 13px;
          font-weight: 600;
          color: #2563eb;
        }
      `}</style>

      <div className="container-fluid orders-wrapper">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* CONTENT */}
          <div className="col-md-9">
            <h3 className="mb-4">All Orders</h3>

            {orders?.map((o, i) => (
              <div className="order-box" key={i}>

                {/* TABLE */}
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Items</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{i + 1}</td>

                      <td>
                        <span className="status-badge">
                          {o?.status}
                        </span>
                      </td>

                      <td>{o?.buyer?.name}</td>

                      <td>{moment(o?.createAt).fromNow()}</td>

                      <td>
                        {o?.payment.success ? "Success" : "Failed"}
                      </td>

                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>

                {/* PRODUCTS */}
                <div>
                  {o?.products?.map((p) => (
                    <div className="product-card" key={p._id}>

                      {p?._id && (
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                        />
                      )}

                      <div>
                        <div className="product-name">{p.name}</div>

                        <div className="product-desc">
                          {p.description.substring(0, 40)}...
                        </div>

                        <div className="price">₹ {p.price}</div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Orders;