import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDatasets } from "../../services/api/datasets";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./DatasetsPage.css";

function DatasetCard({ dataset }) {
  return (
    <Link
      to={`/datasets/${dataset.id}`}
      className="dataset-card"
    >
      <div className="dataset-card__content">
        <div className="dataset-card__top">
          <h2>{dataset.title}</h2>

          <span
            className={`dataset-visibility dataset-visibility--${dataset.visibility}`}
          >
            {dataset.visibility}
          </span>
        </div>

        <p>
          {dataset.description ||
            "No description provided."}
        </p>

        <div className="dataset-card__meta">
          <span>
            Dataset #{dataset.id}
          </span>

          {dataset.request_id && (
            <span>
              Request #{dataset.request_id}
            </span>
          )}

          {dataset.status && (
            <span>
              Status: {dataset.status}
            </span>
          )}
        </div>
      </div>

      <span className="dataset-card__arrow">
        →
      </span>
    </Link>
  );
}

function DatasetsPage() {
  const [datasets, setDatasets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDatasets() {
      try {
        setLoading(true);
        setError("");

        const response = await getDatasets();

        setDatasets(response || []);
      } catch (error) {
        console.error(
          "Failed to load datasets:",
          error
        );

        setError(
          error.message ||
          "Unable to load datasets."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDatasets();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="datasets-page">
      <div className="datasets-header">
        <div>
          <p className="datasets-eyebrow">
            CrowdMine
          </p>

          <h1>Datasets</h1>

          <p className="datasets-description">
            Browse datasets available to you through
            CrowdMine.
          </p>
        </div>

        <div className="datasets-header__actions">
          <span className="datasets-count">
            {datasets.length}
          </span>

          <Link
            to="/datasets/create"
            className="datasets-create-button"
          >
            + Create Dataset
          </Link>
        </div>
      </div>

      {datasets.length === 0 ? (
        <div className="datasets-empty">
          <h2>No datasets available</h2>

          <p>
            Datasets you create or have access to will appear
            here.
          </p>

          <Link
            to="/datasets/create"
            className="datasets-empty-create-button"
          >
            Create Your First Dataset
          </Link>
        </div>
      ) : (
        <section className="datasets-section">
          <div className="datasets-list">
            {datasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DatasetsPage;