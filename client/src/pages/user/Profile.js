// import React, { useState, useEffect } from "react";
// import Layout from "../../components/Layout/Layout";
// import UserMenu from "../../components/Layout/UserMenu";
// import { useAuth } from "../../context/auth";
// import toast from "react-hot-toast";
// import axios from "axios";

// const Profile = () => {
//   const [auth, setAuth] = useAuth();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     address: "",
//   });

//   // Populate form with current user data
//   useEffect(() => {
//     const { name, email, phone, address } = auth?.user || {};
//     setFormData((prev) => ({ ...prev, name, email, phone, address }));
//   }, [auth?.user]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.put("/api/v1/auth/profile", formData);
//       if (data?.error) {
//         toast.error(data.error);
//       } else {
//         setAuth({ ...auth, user: data.updatedUser });
//         const updatedAuth = { ...auth, user: data.updatedUser };
//         localStorage.setItem("auth", JSON.stringify(updatedAuth));
//         toast.success("Profile updated successfully!");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <Layout title="Your Profile">
//       <div className="container-fluid p-3 m-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <UserMenu />
//           </div>
//           <div className="col-md-8">
//             <div className="form-container mt-4">
//               <h4 className="title mb-4">Update Profile</h4>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="Enter your name"
//                     autoFocus
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="Enter your email"
//                     disabled
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="Enter new password (if any)"
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="text"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="Enter your phone"
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder="Enter your address"
//                     required
//                   />
//                 </div>

//                 <button type="submit" className="btn btn-primary w-100">
//                   Update Profile
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [auth, setAuth] = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const { name, email, phone, address } = auth?.user || {};
    setFormData((prev) => ({ ...prev, name, email, phone, address }));
  }, [auth?.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", formData);
      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data.updatedUser });
        const updatedAuth = { ...auth, user: data.updatedUser };
        localStorage.setItem("auth", JSON.stringify(updatedAuth));
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Layout title="Your Profile">

      <style>{`
        .profile-wrapper {
          padding: 30px;
        }

        .profile-card {
          background: #fff;
          border-radius: 20px;
          padding: 30px;
          border: 1px solid #e6efff;
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.08);
        }

        .profile-title {
          font-weight: 600;
          color: #1e293b;
        }

        .form-control {
          border-radius: 10px;
          border: 1px solid #dbeafe;
          font-size: 14px;
        }

        .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .update-btn {
          height: 45px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .update-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }
      `}</style>

      <div className="container-fluid profile-wrapper">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* FORM */}
          <div className="col-md-8">
            <div className="profile-card">

              <h4 className="profile-title mb-4">
                Update Profile
              </h4>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="New password (optional)"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Phone number"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Address"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 text-white update-btn"
                >
                  Update Profile
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>

    </Layout>
  );
};

export default Profile;