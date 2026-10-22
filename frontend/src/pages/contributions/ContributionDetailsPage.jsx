import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getContribution } from "../../services/api/contributions";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./ContributionDetailsPage.css";

function ContributionDetailsPage() {
  const { id } = useParams();

  const [contribution, setContribution] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadContribution() {
      try {
        setLoading(true);
        setError("");

        const response = await getContribution(id);

        setContribution(response);
      } catch (error) {
        console.error(
          "Failed to load contribution:",
          error
        );

        setError(
          error.message ||
            "Unable to load contribution."
        );
      } finally {
        setLoading(false);
      }
    }

    loadContribution();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!contribution) {
    return (
      <ErrorState message="Contribution could not be found." />
    );
  }

  return (
    <div className="contribution-details-page">
      <div className="contribution-details-header">
        <Link
          to="/contributions"
          className="contribution-details-back"
        >
          ← Back to Contributions
        </Link>

        <p className="contribution-details-eyebrow">
          Contribution
        </p>

        <h1>
          {contribution.file_name ||
            "Unnamed Contribution"}
        </h1>

        <p className="contribution-details-description">
          Details and processing status for your submitted
          dataset.
        </p>
      </div>

      <section className="contribution-details-card">
        <div className="contribution-details-card-header">
          <div>
            <h2>Contribution Details</h2>
            <p>
              Information recorded for this submission.
            </p>
          </div>

          <span
            className={`contribution-details-status contribution-details-status--${contribution.status}`}
          >
            {contribution.status}
          </span>
        </div>

        <div className="contribution-details-grid">
          <div className="contribution-details-item">
            <span>Contribution ID</span>
            <strong>
              #{contribution.id}
            </strong>
          </div>

          <div className="contribution-details-item">
            <span>Request ID</span>
            <strong>
              #{contribution.request_id}
            </strong>
          </div>

          <div className="contribution-details-item">
            <span>File Name</span>
            <strong>
              {contribution.file_name ||
                "Not provided"}
            </strong>
          </div>

          <div className="contribution-details-item">
            <span>Status</span>
            <strong>
              {contribution.status}
            </strong>
          </div>
        </div>

        {contribution.notes && (
          <div className="contribution-details-notes">
            <span>Notes</span>

            <p>{contribution.notes}</p>
          </div>
        )}
      </section>

      <section className="contribution-details-card">
        <div className="contribution-details-card-header">
          <div>
            <h2>Request</h2>
            <p>
              The CrowdMine request this contribution
              belongs to.
            </p>
          </div>
        </div>

        <div className="contribution-request-summary">
          <span>
            Request #{contribution.request_id}
          </span>

          <Link
            to="/requests"
            className="contribution-request-link"
          >
            View Requests
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ContributionDetailsPage;