// import React, { useState, useEffect } from "react";
// import Layout from "./../components/Layout/Layout";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// // import "../styles/ProductDetailsStyles.css";

// const ProductDetails = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState({});
//   const [cart, setCart] = useState([]);
//   const [relatedProducts, setRelatedProducts] = useState([]);

//   //initalp details
//   useEffect(() => {
//     if (params?.slug) getProduct();
//   }, [params?.slug]);
//   //getProduct
//   const getProduct = async () => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/get-product/${params.slug}`
//       );
//       setProduct(data?.product);
//       getSimilarProduct(data?.product._id, data?.product.category._id);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   //get similar product
//   const getSimilarProduct = async (pid, cid) => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/related-product/${pid}/${cid}`
//       );
//       setRelatedProducts(data?.products);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <Layout>
//       <div className="row container product-details">
//         <div className="col-md-6">
//           <img
//             src={`/api/v1/product/product-photo/${product._id}`}
//             className="card-img-top"
//             alt={product.name}
//             height="300"
//             width={"350px"}
//           />
//         </div>
//         <div className="col-md-6 product-details-info">
//           <h1 className="text-center">Product Details</h1>
//           <hr />
//           <h6>Name : {product.name}</h6>
//           <h6>Description : {product.description}</h6>
//           <h6>
//             Price :
//             {product?.price?.toLocaleString("en-US", {
//               style: "currency",
//               currency: "USD",
//             })}
//           </h6>
//           <h6>Category : {product?.category?.name}</h6>
//             <button
//                   className="btn btn-dark ms-1"
//                   onClick={() => {
//                     setCart([...cart, product]);
//                     localStorage.setItem(
//                       "cart",
//                       JSON.stringify([...cart, product])
//                     );
//                     toast.success("Item Added to cart");
//                   }}
//                 >
//                   ADD TO CART
//                 </button>
//         </div>
//       </div>
//       <hr />
//       <div className="row container similar-products">
//         <h4>Similar Products ➡️</h4>
//         {relatedProducts.length < 1 && (
//           <p className="text-center">No Similar Products found</p>
//         )}
//         <div className="d-flex flex-wrap">
//           {relatedProducts?.map((p) => (
//             <div className="card m-2" key={p._id}>
//               <img
//                 src={`/api/v1/product/product-photo/${p._id}`}
//                 className="card-img-top"
//                 alt={p.name}
//               />
//               <div className="card-body">
//                 <div className="card-name-price">
//                   <h5 className="card-title">{p.name}</h5>
//                   <h5 className="card-title card-price">
//                     {p.price.toLocaleString("en-US", {
//                       style: "currency",
//                       currency: "USD",
//                     })}
//                   </h5>
//                 </div>
//                 <p className="card-text ">
//                   {p.description.substring(0, 60)}...
//                 </p>
//                 <div className="card-name-price">
//                   <button
//                     className="btn btn-info ms-1"
//                     onClick={() => navigate(`/product/${p.slug}`)}
//                   >
//                     More Details
//                   </button>
//                   <button
//                   className="btn btn-dark ms-1"
//                   onClick={() => {
//                     setCart([...cart, p]);
//                     localStorage.setItem(
//                       "cart",
//                       JSON.stringify([...cart, p])
//                     );
//                     toast.success("Item Added to cart");
//                   }}
//                 >
//                   ADD TO CART
//                 </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProductDetails;



import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  // const [cart, setCart] = useState([]);
  const [cart, setCart] = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>

      {/* STYLE */}
      <style>{`
        .product-wrapper {
          margin-top: 40px;
          padding: 30px;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .product-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 16px;
           object-position: top;
          
        }

        .product-info {
          padding-left: 20px;
        }

        .product-title {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .product-desc {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 15px;
        }

        .product-price {
          font-size: 22px;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 10px;
        }

        .add-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .add-btn:hover {
          box-shadow: 0 8px 20px rgba(37,99,235,0.3);
          transform: translateY(-1px);
        }

        .related-title {
          margin-top: 50px;
          font-weight: 600;
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

        .product-card img {
          height: 260px;
          object-fit: cover;
          object-position: center;
        }

        .product-card .card-body {
          padding: 12px;
        }
      `}</style>

      {/* PRODUCT */}
      <div className="container product-wrapper">
        <div className="row align-items-center">

          <div className="col-md-6">
            {product?._id && (
              <img
                src={`/api/v1/product/product-photo/${product._id}`}
                className="product-image"
                alt={product.name}
              />
            )}
          </div>

          <div className="col-md-6 product-info">
            <div className="product-title">{product.name}</div>

            <div className="product-desc">
              {product.description}
            </div>

            <div className="product-price">
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>

            <div className="mb-2">
              Category: <b>{product?.category?.name}</b>
            </div>

            <button
              className="btn text-white add-btn"
              onClick={() => {
                setCart([...cart, product]);
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product])
                );
                toast.success("Item Added to cart");
              }}
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>

      {/* RELATED */}
      <div className="container">
        <h4 className="related-title">Similar Products</h4>

        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}

        <div className="d-flex flex-wrap gap-3 mt-3">

          {relatedProducts?.map((p) => (
            <div className="card product-card" key={p._id}>

              {p?._id && (
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                />
              )}

              <div className="card-body">
                <h6>{p.name}</h6>

                <p className="text-muted small">
                  {p.description.substring(0, 40)}...
                </p>

                <p className="text-primary fw-semibold">
                  ${p.price}
                </p>

                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-outline-primary btn-sm w-50"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    Details
                  </button>

                  <button
                    className="btn btn-primary btn-sm w-50"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to cart");
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>

    </Layout>
  );
};

export default ProductDetails;