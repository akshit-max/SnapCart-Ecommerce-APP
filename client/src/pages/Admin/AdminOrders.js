// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import Layout from "../../components/Layout/Layout";
// import { useAuth } from "../../context/auth";
// import moment from "moment";
// import { Select } from "antd";
// const { Option } = Select;

// const AdminOrders = () => {
//   const [status, setStatus] = useState([
//     "Not Process",
//     "Processing",
//     "Shipped",
//     "deliverd",
//     "cancel",
//   ]);
//   const [changeStatus, setCHangeStatus] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [auth, setAuth] = useAuth();
//   const getOrders = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/auth/all-orders");
//       setOrders(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) getOrders();
//   }, [auth?.token]);

//   const handleChange = async (orderId, value) => {
//     try {
//       const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
//         status: value,
//       });
//       getOrders();
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <Layout title={"All Orders Data"}>
//       <div className="row dashboard">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center">All Orders</h1>
//           {orders?.map((o, i) => {
//             return (
//               <div className="border shadow">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th scope="col">#</th>
//                       <th scope="col">Status</th>
//                       <th scope="col">Buyer</th>
//                       <th scope="col"> date</th>
//                       <th scope="col">Payment</th>
//                       <th scope="col">Quantity</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>{i + 1}</td>
//                       <td>
//                         <Select
//                           bordered={false}
//                           onChange={(value) => handleChange(o._id, value)}
//                           defaultValue={o?.status}
//                         >
//                           {status.map((s, i) => (
//                             <Option key={i} value={s}>
//                               {s}
//                             </Option>
//                           ))}
//                         </Select>
//                       </td>
//                       <td>{o?.buyer?.name}</td>
//                       <td>{moment(o?.createAt).fromNow()}</td>
//                       <td>{o?.payment.success ? "Success" : "Failed"}</td>
//                       <td>{o?.products?.length}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <div className="container">
//                   {o?.products?.map((p, i) => (
//                     <div className="row mb-2 p-3 card flex-row" key={p._id}>
//                       <div className="col-md-4">
//                         <img
//                           src={`/api/v1/product/product-photo/${p._id}`}
//                           className="card-img-top"
//                           alt={p.name}
//                           width="100px"
//                           height={"300px"}
//                         />
//                       </div>
//                       <div className="col-md-8">
//                         <p>{p.name}</p>
//                         <p>{p.description.substring(0, 30)}</p>
//                         <p>Price : {p.price}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div> 
//     </Layout>
//   );
// };

// export default AdminOrders;



import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);

  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // GET ORDERS
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // UPDATE STATUS
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      toast.success("Status updated");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div
        className="container-fluid px-4 py-3"
        style={{ background: "#f4f7fb" }}
      >
        <div className="row">

          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Main */}
          <div className="col-md-9">

            {/* Header */}
            <div className="mb-4">
              <h2 style={{ fontWeight: "600", color: "#1e293b" }}>
                All Orders
              </h2>
              <p style={{ color: "#64748b" }}>
                Manage customer orders and track status
              </p>
            </div>

            {/* Orders */}
            {orders?.map((o, i) => (
              <div
                key={o._id}
                className="mb-4 p-3"
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                {/* Order Table */}
                <table className="table align-middle">
                  <thead style={{ background: "#eff6ff" }}>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{i + 1}</td>

                      <td>
                        <Select
                          bordered={false}
                          defaultValue={o?.status}
                          style={{
                            background: "#e0f2fe",
                            borderRadius: "6px",
                            padding: "2px 8px",
                          }}
                          onChange={(value) =>
                            handleChange(o._id, value)
                          }
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>

                      <td style={{ fontWeight: "500" }}>
                        {o?.buyer?.name}
                      </td>

                      <td style={{ color: "#64748b" }}>
                        {moment(o?.createdAt).fromNow()}
                      </td>

                      <td>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            background: o?.payment?.success
                              ? "#dcfce7"
                              : "#fee2e2",
                            color: o?.payment?.success
                              ? "#166534"
                              : "#991b1b",
                          }}
                        >
                          {o?.payment?.success ? "Success" : "Failed"}
                        </span>
                      </td>

                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Products */}
                <div className="mt-3">
                  {o?.products?.map((p) => (
                    <div
                      key={p._id}
                      className="d-flex align-items-center mb-3 p-3"
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        background: "#f9fafb",
                      }}
                    >
                      {/* Image */}
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginRight: "15px",
                        }}
                      />

                      {/* Info */}
                      <div>
                        <h6 style={{ margin: 0 }}>{p.name}</h6>
                        <p
                          style={{
                            margin: "5px 0",
                            color: "#6b7280",
                            fontSize: "14px",
                          }}
                        >
                          {p.description.substring(0, 40)}...
                        </p>
                        <strong style={{ color: "#2563eb" }}>
                          ₹ {p.price}
                        </strong>
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

export default AdminOrders;