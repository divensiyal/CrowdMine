import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRequest } from "../../services/api/requests";
import "./CreateRequestPage.css";

function CreateRequestPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetRecords: "100",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a request title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    const targetRecords = Number(formData.targetRecords);

    if (!targetRecords || targetRecords <= 0) {
      setError("Target records must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await createRequest({
        title: formData.title.trim(),
        description: formData.description.trim(),
        target_records: targetRecords,
      });

      console.log("Request created:", response);

      navigate(
        `/requests/create/schema?requestId=${response.request_id}`
      );
    } catch (error) {
      console.error("Request creation failed:", error);

      setError(
        error.message || "Unable to create the request."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="create-request-page">
      <div className="create-request-header">
        <div>
          <Link to="/requests" className="create-request-back">
            ← Back to Requests
          </Link>

          <p className="create-request-eyebrow">CrowdMine</p>

          <h1>Create Data Request</h1>

          <p className="create-request-description">
            Define what data you need and provide contributors
            with a clear collection target.
          </p>
        </div>
      </div>

      <form className="create-request-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-header">
            <h2>Request Information</h2>

            <p>
              Give your data request a clear identity and purpose.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="title">
              Request Title <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Urban Street Image Collection"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span>*</span>
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Describe what this request is about..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetRecords">
              Target Records <span>*</span>
            </label>

            <input
              id="targetRecords"
              name="targetRecords"
              type="number"
              min="1"
              placeholder="e.g. 100"
              value={formData.targetRecords}
              onChange={handleChange}
            />

            <small className="form-help">
              The number of contributions you want to collect.
            </small>
          </div>
        </div>

        {error && (
          <p className="create-request-error">
            {error}
          </p>
        )}

        <div className="create-request-actions">
          <Link
            to="/requests"
            className="create-request-cancel"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="create-request-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Request..."
              : "Continue to Schema"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRequestPage;