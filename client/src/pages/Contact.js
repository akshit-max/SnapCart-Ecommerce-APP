import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BiMailSend, BiPhoneCall, BiTime } from "react-icons/bi";
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
    <Layout title="Contact Us">
      <div className="container mt-3">
        <h2 className="page-title mb-4">Contact Us</h2>

        <div className="row g-4">
          <div className="col-md-5">
            <div className="card-box h-100">
              <h5 className="fw-semibold">Get in touch</h5>
              <p className="text-muted-soft">Questions about an order or a product? We're happy to help.</p>

              <p className="d-flex align-items-center gap-2">
                <BiMailSend className="text-primary" /> support@snapcart.com
              </p>
              <p className="d-flex align-items-center gap-2">
                <BiPhoneCall className="text-primary" /> +91 98765 43210
              </p>
              <p className="d-flex align-items-center gap-2 mb-0">
                <BiTime className="text-primary" /> Mon - Sat, 10am to 7pm
              </p>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card-box">
              <h5 className="fw-semibold mb-3">Send a message</h5>
              <form onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange}
                  className="form-control mb-3" placeholder="Your name" required />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="form-control mb-3" placeholder="Your email" required />
                <textarea name="message" value={form.message} onChange={handleChange}
                  className="form-control mb-3" rows={5} placeholder="Your message" maxLength={2000} required />
                <button type="submit" className="btn btn-brand w-100 py-2" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
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
