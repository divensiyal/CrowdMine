import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyContributions } from "../../services/api/contributions";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./ContributionsPage.css";

function ContributionsPage() {
  const [contributions, setContributions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadContributions() {
      try {
        setLoading(true);
        setError("");

        const response = await getMyContributions();

        setContributions(response || []);
      } catch (error) {
        console.error(
          "Failed to load contributions:",
          error
        );

        setError(
          error.message ||
            "Unable to load your contributions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadContributions();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="contributions-page">
      <div className="contributions-header">
        <div>
          <p className="contributions-eyebrow">
            CrowdMine
          </p>

          <h1>My Contributions</h1>

          <p className="contributions-description">
            Track the datasets you have submitted to
            CrowdMine requests.
          </p>
        </div>
      </div>

      {contributions.length === 0 ? (
        <div className="contributions-empty">
          <h2>No contributions yet</h2>

          <p>
            Your uploaded datasets will appear here
            once you contribute to a request.
          </p>

          <Link
            to="/requests"
            className="contributions-empty-button"
          >
            Discover Requests
          </Link>
        </div>
      ) : (
        <section className="contributions-section">
          <div className="contributions-section-header">
            <div>
              <h2>Submission History</h2>

              <p>
                Your previous data contributions.
              </p>
            </div>

            <span className="contributions-count">
              {contributions.length}
            </span>
          </div>

          <div className="contributions-list">
            {contributions.map((contribution) => (
              <Link
                key={contribution.id}
                to={`/contributions/${contribution.id}`}
                className="contribution-card"
              >
                <div className="contribution-card__main">
                  <div className="contribution-card__top">
                    <h3>
                      {contribution.file_name ||
                        "Unnamed contribution"}
                    </h3>

                    <span
                      className={`contribution-status contribution-status--${contribution.status}`}
                    >
                      {contribution.status}
                    </span>
                  </div>

                  <div className="contribution-card__meta">
                    <span>
                      Contribution #{contribution.id}
                    </span>

                    <span>
                      Request #{contribution.request_id}
                    </span>
                  </div>

                  {contribution.notes && (
                    <p className="contribution-card__notes">
                      {contribution.notes}
                    </p>
                  )}
                </div>

                <span className="contribution-card__arrow">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ContributionsPage;