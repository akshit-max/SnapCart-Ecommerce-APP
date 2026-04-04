// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout/Layout";
// import { useParams, useNavigate } from "react-router-dom";
// // import "../styles/CategoryProductStyles.css";
// import axios from "axios";
// const CategoryProduct = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [category, setCategory] = useState([]);

//   useEffect(() => {
//     if (params?.slug) getPrductsByCat();
//   }, [params?.slug]);
//   const getPrductsByCat = async () => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/product-category/${params.slug}`
//       );
//       setProducts(data?.products);
//       setCategory(data?.category);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Layout>
//       <div className="container mt-3 category">
//         <h4 className="text-center">Category - {category?.name}</h4>
//         <h6 className="text-center">{products?.length} result found </h6>
//         <div className="row">
//           <div className="col-md-9 offset-1">
//             <div className="d-flex flex-wrap">
//               {products?.map((p) => (
//                 <div className="card m-2" key={p._id}>
//                   <img
//                     src={`/api/v1/product/product-photo/${p._id}`}
//                     className="card-img-top"
//                     alt={p.name}
//                   />
//                   <div className="card-body">
//                     <div className="card-name-price">
//                       <h5 className="card-title">{p.name}</h5>
//                       <h5 className="card-title card-price">
//                         {p.price.toLocaleString("en-US", {
//                           style: "currency",
//                           currency: "USD",
//                         })}
//                       </h5>
//                     </div>
//                     <p className="card-text ">
//                       {p.description.substring(0, 60)}...
//                     </p>
//                     <div className="card-name-price">
//                       <button
//                         className="btn btn-info ms-1"
//                         onClick={() => navigate(`/product/${p.slug}`)}
//                       >
//                         More Details
//                       </button>
//                       {/* <button
//                     className="btn btn-dark ms-1"
//                     onClick={() => {
//                       setCart([...cart, p]);
//                       localStorage.setItem(
//                         "cart",
//                         JSON.stringify([...cart, p])
//                       );
//                       toast.success("Item Added to cart");
//                     }}
//                   >
//                     ADD TO CART
//                   </button> */}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* <div className="m-2 p-3">
//             {products && products.length < total && (
//               <button
//                 className="btn btn-warning"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setPage(page + 1);
//                 }}
//               >
//                 {loading ? "Loading ..." : "Loadmore"}
//               </button>
//             )}
//           </div> */}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CategoryProduct;




import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>

      {/* STYLE */}
      <style>{`
        .category-wrapper {
          margin-top: 30px;
        }

        .category-title {
          font-weight: 600;
          color: #1e293b;
        }

        .category-sub {
          color: #64748b;
          font-size: 14px;
        }

        .product-card {
          width: 250px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e6efff;
          transition: all 0.25s ease;
          background: #fff;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(37,99,235,0.15);
        }

        .product-img {
          height: 220px;
          object-fit: cover;
          object-position: top;
        }

        .product-title {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
        }

        .product-desc {
          font-size: 13px;
          color: #64748b;
        }

        .product-price {
          font-weight: 600;
          color: #2563eb;
        }

        .btn-outline-custom {
          border-radius: 8px;
          border: 1px solid #dbeafe;
          font-size: 13px;
        }

        .btn-outline-custom:hover {
          background: #f1f5ff;
        }
      `}</style>

      <div className="container category-wrapper">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h3 className="category-title">
            Category: {category?.name}
          </h3>

          <p className="category-sub">
            {products?.length} products found
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="d-flex flex-wrap justify-content-center gap-3">

          {products?.map((p) => (
            <div className="card product-card" key={p._id}>

              {p?._id && (
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="product-img"
                  alt={p.name}
                />
              )}

              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">
                  <div className="product-title">{p.name}</div>

                  <div className="product-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                </div>

                <p className="product-desc mt-2">
                  {p.description.substring(0, 50)}...
                </p>

                <button
                  className="btn btn-outline-custom w-100 mt-2"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  View Details
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>

    </Layout>
  );
};

export default CategoryProduct;