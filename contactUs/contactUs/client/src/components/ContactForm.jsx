import { useState } from "react";
import { useAuth } from "../store/auth";

const URL = "http://localhost:3000/api/auth/contact";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

const { storeTokenInLs } = useAuth();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setLoading(true);

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Message sent successfully!");
        storeTokenInLs(data.token);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setServerError(data.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setServerError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Contact Us
        </h2>

        {serverError && (
          <p className="text-red-500 text-center mb-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block font-medium text-gray-700"
            >
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
