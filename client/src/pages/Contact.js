import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { BiMailSend, BiPhoneCall, BiSupport } from 'react-icons/bi';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/contact/send", formData);
      alert(res.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Try again later.");
    }
    setLoading(false);
  };

  return (
    <Layout title={'Contact Us'}>

      {/* STYLE */}
      <style>{`
        .contact-wrapper {
          background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
          padding: 50px 20px;
        }

        .contact-card {
          border-radius: 18px;
          padding: 25px;
          background: #ffffff;
          border: 1px solid #e6efff;
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.08);
        }

        .contact-title {
          font-weight: 600;
          color: #1e293b;
        }

        .contact-text {
          font-size: 14px;
          color: #64748b;
        }

        .icon {
          color: #2563eb;
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

        .send-btn {
          height: 45px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .send-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .contact-img {
          border-radius: 12px;
          margin-top: 15px;
        }
      `}</style>

      <div className="contact-wrapper">
        <div className="container">

          <h2 className="text-center contact-title mb-4">
            Contact Us
          </h2>

          <div className="row justify-content-center align-items-center">

            {/* LEFT */}
            <div className="col-md-5 mb-4">
              <div className="contact-card">

                <h4 className="contact-title mb-2">Get in Touch</h4>

                <p className="contact-text">
                  Have any questions or concerns? We’re always ready to help!
                </p>

                <ul className="list-unstyled mt-3 contact-text">
                  <li className="mb-2">
                    <BiMailSend className="me-2 icon" />
                    <strong>Email:</strong> help@SnapCart.com
                  </li>

                  <li className="mb-2">
                    <BiPhoneCall className="me-2 icon" />
                    <strong>Phone:</strong> +91-012-3456789
                  </li>

                  <li className="mb-2">
                    <BiSupport className="me-2 icon" />
                    <strong>Support:</strong> 1800-0000-0000
                  </li>
                </ul>

                <img
                  src="/images/contactus.jpeg"
                  alt="Contact"
                  className="img-fluid contact-img"
                />

              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="col-md-6">
              <div className="contact-card">

                <h4 className="contact-title mb-3">
                  Send a message
                </h4>

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 text-white send-btn"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>

                </form>

              </div>
            </div>

          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Contact;