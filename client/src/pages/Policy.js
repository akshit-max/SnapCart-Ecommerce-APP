import Layout from "../components/Layout/Layout";

const sections = [
  {
    title: "Information We Collect",
    text: "When you create an account or place an order we collect your name, email, phone number and delivery address. Payments are handled by Razorpay, so we never see or store your card details.",
  },
  {
    title: "How We Use It",
    text: "Your details are used to process orders, deliver them, and help you with your account. We do not sell your data to anyone.",
  },
  {
    title: "Data Security",
    text: "Passwords are hashed before they are stored and all payment information goes directly to Razorpay over HTTPS.",
  },
  {
    title: "Cookies & Local Storage",
    text: "We use your browser's local storage to keep you logged in and remember your cart. You can clear it from your browser settings at any time.",
  },
  {
    title: "Changes to this Policy",
    text: "If this policy changes, the updated version will be posted on this page.",
  },
];

const Policy = () => {
  return (
    <Layout title="Privacy Policy">
      <div className="container content-page">
        <div className="card-box">
          <h2 className="page-title mb-4">Privacy Policy</h2>

          {sections.map((section) => (
            <section className="mb-4" key={section.title}>
              <h6 className="section-heading">{section.title}</h6>
              <p className="text-muted-soft mb-0">{section.text}</p>
            </section>
          ))}

          <p className="text-muted-soft mb-0">
            Questions? Write to us at <b>support@snapcart.com</b>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
