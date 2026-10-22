import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getDataset,
  updateDataset,
} from "../../services/api/datasets";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./EditDatasetPage.css";

function EditDatasetPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    visibility: "public",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadDataset() {
      try {
        setLoading(true);
        setError("");

        const dataset = await getDataset(id);

        setForm({
          title: dataset.title || "",
          description: dataset.description || "",
          visibility: dataset.visibility || "public",
        });
      } catch (error) {
        console.error(
          "Failed to load dataset:",
          error
        );

        setError(
          error.message ||
            "Unable to load dataset."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDataset();
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

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Dataset title is required.");
      return;
    }

    try {
      setSaving(true);

      await updateDataset(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        visibility: form.visibility,
      });

      setSuccess("Dataset updated successfully.");

      setTimeout(() => {
        navigate(`/datasets/${id}`);
      }, 800);
    } catch (error) {
      console.error(
        "Failed to update dataset:",
        error
      );

      setError(
        error.message ||
          "Unable to update dataset."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !form.title) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="edit-dataset-page">
      <div className="edit-dataset-header">
        <Link
          to={`/datasets/${id}`}
          className="edit-dataset-back"
        >
          ← Back to Dataset
        </Link>

        <p className="edit-dataset-eyebrow">
          DATASET
        </p>

        <h1>Edit Dataset</h1>

        <p>
          Update the information and visibility
          settings for this dataset.
        </p>
      </div>

      <div className="edit-dataset-card">
        <form onSubmit={handleSubmit}>
          <div className="edit-dataset-field">
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

          <div className="edit-dataset-field">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this dataset"
            />
          </div>

          <div className="edit-dataset-field">
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
            </select>
          </div>

          {error && (
            <div className="edit-dataset-error">
              {error}
            </div>
          )}

          {success && (
            <div className="edit-dataset-success">
              {success}
            </div>
          )}

          <div className="edit-dataset-actions">
            <Link
              to={`/datasets/${id}`}
              className="edit-dataset-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="edit-dataset-submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDatasetPage;