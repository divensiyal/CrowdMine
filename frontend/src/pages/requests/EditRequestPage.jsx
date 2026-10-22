import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRequest, updateRequest } from "../../services/api/requests";
import "./EditRequestPage.css";

function EditRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadRequest() {
      try {
        setLoading(true);
        setError("");

        const data = await getRequest(id);

        setForm({
          title: data.title || "",
          description: data.description || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load request.");
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Request title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Request description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateRequest(id, {
        title: form.title.trim(),
        description: form.description.trim(),
      });

      setSuccess("Request updated successfully.");

      setTimeout(() => {
        navigate(`/requests/${id}`);
      }, 700);
    } catch (err) {
      setError(err.message || "Failed to update request.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="edit-request-page">
        <div className="edit-request-card">
          <p>Loading request...</p>
        </div>
      </div>
    );
  }

  if (error && !form.title && !form.description) {
    return (
      <div className="edit-request-page">
        <div className="edit-request-card">
          <h1>Unable to load request</h1>
          <p className="edit-request-error">{error}</p>

          <Link to="/requests" className="edit-request-back">
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-request-page">
      <div className="edit-request-header">
        <div>
          <Link to={`/requests/${id}`} className="edit-request-back">
            ← Back to Request
          </Link>

          <h1>Edit Request</h1>
          <p>
            Update the basic information for your dataset request.
          </p>
        </div>
      </div>

      <div className="edit-request-card">
        <form onSubmit={handleSubmit}>
          <div className="edit-request-field">
            <label htmlFor="title">Request Title</label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter request title"
            />
          </div>

          <div className="edit-request-field">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              rows="6"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the data you need"
            />
          </div>

          {error && (
            <div className="edit-request-message edit-request-message--error">
              {error}
            </div>
          )}

          {success && (
            <div className="edit-request-message edit-request-message--success">
              {success}
            </div>
          )}

          <div className="edit-request-actions">
            <Link
              to={`/requests/${id}`}
              className="edit-request-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="edit-request-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRequestPage;