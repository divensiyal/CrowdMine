import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createDataset } from "../../services/api/datasets";

import "./CreateDatasetPage.css";

function CreateDatasetPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    request_id: "",
    visibility: "public",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Dataset title is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        visibility: form.visibility,
      };

      if (form.request_id.trim()) {
        payload.request_id = Number(form.request_id);
      }

      const response = await createDataset(payload);

      const datasetId = response.dataset_id;

      if (datasetId) {
        navigate(`/datasets/${datasetId}`);
      } else {
        navigate("/datasets");
      }
    } catch (error) {
      console.error("Failed to create dataset:", error);

      setError(
        error.message || "Unable to create the dataset."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="create-dataset-page">
      <div className="create-dataset-header">
        <Link
          to="/datasets"
          className="create-dataset-back"
        >
          ← Back to Datasets
        </Link>

        <p className="create-dataset-eyebrow">
          DATASET
        </p>

        <h1>Create Dataset</h1>

        <p>
          Create a dataset from your collected contribution
          data.
        </p>
      </div>

      <div className="create-dataset-card">
        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="create-dataset-field">
            <label htmlFor="title">
              Dataset Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter dataset title"
            />
          </div>

          {/* Description */}
          <div className="create-dataset-field">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what this dataset contains"
            />
          </div>

          {/* Request ID */}
          <div className="create-dataset-field">
            <label htmlFor="request_id">
              Request ID
              <span className="optional-label">
                Optional
              </span>
            </label>

            <input
              id="request_id"
              name="request_id"
              type="number"
              min="1"
              value={form.request_id}
              onChange={handleChange}
              placeholder="Example: 3"
            />

            <small>
              Enter the request ID if this dataset belongs
              to a specific data request.
            </small>
          </div>

          {/* Visibility */}
          <div className="create-dataset-field">
            <label htmlFor="visibility">
              Visibility
            </label>

            <select
              id="visibility"
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
            >
              <option value="public">
                Public
              </option>

              <option value="restricted">
                Restricted
              </option>

              <option value="private">
                Private
              </option>
            </select>

            <small>
              Public datasets can be viewed by users.
              Restricted datasets require access.
            </small>
          </div>

          {/* Error */}
          {error && (
            <div className="create-dataset-error">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="create-dataset-actions">
            <Link
              to="/datasets"
              className="create-dataset-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="create-dataset-submit"
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Dataset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDatasetPage;