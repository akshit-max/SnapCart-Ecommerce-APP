import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiClock, FiMapPin, FiSend, FiMessageSquare } from "react-icons/fi";
import Layout from "../components/Layout/Layout";
import { getErrorMessage } from "../utils/helpers";

const emptyForm = { name: "", email: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await axios.post("/api/v1/contact/send", form);
      toast.success(data.message);
      setForm(emptyForm);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setSending(false);
  };

  return (
    <Layout title="Contact Us - SnapCart">
      <div className="container py-4">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-2">
            HELP & SUPPORT
          </span>
          <h2 className="fw-bold text-dark">We're Here to Help</h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: "480px" }}>
            Have a question about sizing, order tracking, returns, or partnership inquiries? Drop us a line.
          </p>
        </div>

        <div className="row g-4">
          {/* Contact Information Cards */}
          <div className="col-lg-5">
            <div className="card-box h-100 p-4">
              <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <FiMessageSquare className="text-primary" /> Contact Information
              </h5>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="trust-icon-wrap" style={{ width: "40px", height: "40px" }}>
                    <FiMail />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Email Inquiries</h6>
                    <p className="text-muted small mb-0">support@snapcart.com</p>
                    <span className="small text-success fw-semibold">Responses within 2 hours</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="trust-icon-wrap" style={{ width: "40px", height: "40px" }}>
                    <FiPhone />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Customer Helpline</h6>
                    <p className="text-muted small mb-0">+91 (800) 123-4567</p>
                    <span className="small text-muted">Toll-free across India</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="trust-icon-wrap" style={{ width: "40px", height: "40px" }}>
                    <FiClock />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Operating Hours</h6>
                    <p className="text-muted small mb-0">Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
                    <span className="small text-muted">Sunday: 10:00 AM – 4:00 PM IST</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="trust-icon-wrap" style={{ width: "40px", height: "40px" }}>
                    <FiMapPin />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Headquarters</h6>
                    <p className="text-muted small mb-0">SnapCart Commerce Park, Cyber City</p>
                    <span className="small text-muted">Gurugram, Haryana 122002, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="col-lg-7">
            <div className="card-box p-4 p-lg-5">
              <h5 className="fw-bold text-dark mb-2">Send us a Message</h5>
              <p className="text-muted small mb-4">
                Fill out the form below and our customer support concierge will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Your Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. rahul@example.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="form-control"
                    rows={5}
                    placeholder="How can we assist you today? Please include order number if applicable."
                    maxLength={2000}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-brand w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={sending}
                >
                  <FiSend /> {sending ? "Sending Message..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
