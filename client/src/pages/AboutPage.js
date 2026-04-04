// import React from 'react';
// import Layout from '../components/Layout/Layout';

// const AboutPage = () => {
//   return (
//     <Layout title={"About Us - SnapCart"} description="Learn more about SnapCart and our mission.">
//       <div className="container mt-5 mb-5">
//         <div className="text-center mb-4">
//           <h1 className="display-5 fw-bold">About <span className="text-primary">SnapCart</span></h1>
//           <p className="text-muted">A premium destination for all your shopping needs</p>
//         </div>
//         <div className="row justify-content-center">
//           <div className="col-md-8">
//             <div className="card shadow-sm p-4">
//               <p className="lead">
//                 Welcome to <strong>SnapCart 🛍️</strong> — your trusted destination for the best online shopping experience.
//               </p>
//               <p>
//                 Since our founding in 2025, our mission has been to blend convenience with top-notch service. From tech to fashion, every product on our platform is curated with care, and customer satisfaction is our top priority.
//               </p>
//               <p>
//                 Our journey started with a passion for innovation and customer experience. Today, we serve thousands of happy customers across India and beyond.
//               </p>
//               <p>
//                 Whether you're here to explore new styles or grab essentials, SnapCart promises fast delivery, secure payment, and an ever-growing catalog of amazing finds.
//               </p>
//               <p className="text-muted text-end">— Team SnapCart</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AboutPage;



import React from 'react';
import Layout from '../components/Layout/Layout';

const AboutPage = () => {
  return (
    <Layout title={"About Us - SnapCart"} description="Learn more about SnapCart and our mission.">

      <style>{`
        .about-wrapper {
          background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
          padding: 60px 20px;
        }

        .about-title {
          font-weight: 700;
          color: #1e293b;
        }

        .about-sub {
          color: #64748b;
          font-size: 14px;
        }

        .about-card {
          border-radius: 20px;
          padding: 35px;
          background: #ffffff;
          border: 1px solid #e6efff;
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.08);
        }

        .about-text {
          font-size: 15px;
          color: #475569;
          line-height: 1.7;
        }

        .about-highlight {
          color: #2563eb;
          font-weight: 600;
        }

        .about-footer {
          text-align: right;
          color: #64748b;
          margin-top: 15px;
        }
      `}</style>

      <div className="about-wrapper">

        <div className="container">

          {/* HEADER */}
          <div className="text-center mb-5">
            <h1 className="about-title">
              About <span className="about-highlight">SnapCart</span>
            </h1>

            <p className="about-sub">
              A premium destination for all your shopping needs
            </p>
          </div>

          {/* CARD */}
          <div className="row justify-content-center">
            <div className="col-md-8">

              <div className="about-card">

                <p className="about-text">
                  Welcome to <strong>SnapCart 🛍️</strong> — your trusted destination for the best online shopping experience.
                </p>

                <p className="about-text">
                  Since our founding in 2025, our mission has been to blend convenience with top-notch service. From tech to fashion, every product on our platform is curated with care, and customer satisfaction is our top priority.
                </p>

                <p className="about-text">
                  Our journey started with a passion for innovation and customer experience. Today, we serve thousands of happy customers across India and beyond.
                </p>

                <p className="about-text">
                  Whether you're here to explore new styles or grab essentials, SnapCart promises fast delivery, secure payment, and an ever-growing catalog of amazing finds.
                </p>

                <div className="about-footer">
                  — Team SnapCart
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

    </Layout>
  );
};

export default AboutPage;
