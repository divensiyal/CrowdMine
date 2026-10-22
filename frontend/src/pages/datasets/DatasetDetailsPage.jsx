import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getDataset,
  deleteDataset,
} from "../../services/api/datasets";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./DatasetDetailsPage.css";

function DatasetDetailsPage() {
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const { id } = useParams();

  const [dataset, setDataset] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dataset?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteDataset(id);

      navigate("/datasets");
    } catch (error) {
      console.error("Failed to delete dataset:", error);

      setDeleteError(
        error.message || "Unable to delete the dataset."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    async function loadDataset() {
      try {
        setLoading(true);
        setError("");

        const response = await getDataset(id);

        setDataset(response);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!dataset) {
    return (
      <ErrorState message="Dataset could not be found." />
    );
  }

  return (
    <div className="dataset-details-page">
      <div className="dataset-details-header">
        <Link
          to="/datasets"
          className="dataset-details-back"
        >
          ← Back to Datasets
        </Link>

        <div className="dataset-details-title-row">
          <div>
            <p className="dataset-details-eyebrow">
              Dataset
            </p>

            <h1>{dataset.title}</h1>

            <p className="dataset-details-description">
              {dataset.description ||
                "No description provided."}
            </p>
          </div>

          <span
            className={`dataset-details-visibility dataset-details-visibility--${dataset.visibility}`}
          >
            {dataset.visibility}
          </span>
        </div>
      </div>

      <section className="dataset-details-card">
        <div className="dataset-details-card-header">
          <div>
            <h2>Dataset Information</h2>

            <p>
              Basic information about this dataset.
            </p>
          </div>
        </div>

        <div className="dataset-details-grid">
          <div className="dataset-details-item">
            <span>Dataset ID</span>
            <strong>#{dataset.id}</strong>
          </div>

          <div className="dataset-details-item">
            <span>Status</span>
            <strong>
              {dataset.status || "Not specified"}
            </strong>
          </div>

          <div className="dataset-details-item">
            <span>Visibility</span>
            <strong>
              {dataset.visibility}
            </strong>
          </div>

          <div className="dataset-details-item">
            <span>Request ID</span>
            <strong>
              {dataset.request_id
                ? `#${dataset.request_id}`
                : "Not linked"}
            </strong>
          </div>
        </div>
      </section>

      <section className="dataset-details-card">
        <div className="dataset-details-card-header">
          <div>
            <h2>Dataset Actions</h2>

            <p>
              Available actions for this dataset.
            </p>
          </div>
        </div>

        <div className="dataset-details-actions">
          <Link
            to={`/datasets/${id}/edit`}
            className="dataset-edit-button"
          >
            Edit Dataset
          </Link>

          <button
            type="button"
            className="dataset-delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Dataset"}
          </button>
        </div>

        {deleteError && (
          <p className="dataset-details-error">
            {deleteError}
          </p>
        )}

        <div className="dataset-details-actions">
          <button
            type="button"
            className="dataset-action-button dataset-action-button--disabled"
            disabled
          >
            Preview
            <span>Coming later</span>
          </button>

          <button
            type="button"
            className="dataset-action-button dataset-action-button--disabled"
            disabled
          >
            Download
            <span>Coming later</span>
          </button>
        </div>

        <p className="dataset-details-note">
          Preview and download are not currently
          exposed by the backend dataset API.
        </p>
      </section>
    </div>
  );
}

export default DatasetDetailsPage;