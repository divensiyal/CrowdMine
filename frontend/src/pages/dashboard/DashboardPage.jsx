import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getMyRequests } from "../../services/api/requests";
import { getMyContributions } from "../../services/api/contributions";
import { getDatasets } from "../../services/api/datasets";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./DashboardPage.css";

function DashboardPage() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [datasets, setDatasets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          requestsData,
          contributionsData,
          datasetsData,
        ] = await Promise.all([
          getMyRequests(),
          getMyContributions(),
          getDatasets(),
        ]);

        setRequests(requestsData || []);
        setContributions(contributionsData || []);
        setDatasets(datasetsData || []);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        setError(
          error.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const activeRequests = requests.filter(
    (request) => request.status === "published"
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            CrowdMine Dashboard
          </p>

          <h1>
            Welcome back,{" "}
            {user?.username || "User"}.
          </h1>

          <p className="dashboard-description">
            Manage your data requests, contributions,
            and datasets from one place.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="dashboard-card__label">
            Active Requests
          </span>

          <strong>
            {activeRequests.length}
          </strong>

          <p>
            Requests currently accepting
            contributions.
          </p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card__label">
            Contributions
          </span>

          <strong>
            {contributions.length}
          </strong>

          <p>
            Your submitted contributions.
          </p>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card__label">
            Datasets
          </span>

          <strong>
            {datasets.length}
          </strong>

          <p>
            Datasets available to you.
          </p>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section dashboard-datasets">
          <div className="dashboard-section__header">
            <div>
              <p className="dashboard-section__eyebrow">
                Requests
              </p>

              <h2>
                Your data requests
              </h2>
            </div>

            <Link
              to="/requests"
              className="dashboard-section__link"
            >
              View all →
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="dashboard-empty">
              <p>
                You haven't created any requests yet.
              </p>

              <Link
                to="/requests/create"
                className="dashboard-action-button"
              >
                Create Request
              </Link>
            </div>
          ) : (
            <div className="dashboard-list">
              {requests.slice(0, 3).map((request) => (
                <Link
                  key={request.id}
                  to={`/requests/${request.id}`}
                  className="dashboard-list-item"
                >
                  <div>
                    <strong>
                      {request.title}
                    </strong>

                    <span>
                      {request.status || "draft"}
                    </span>
                  </div>

                  <span>→</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section dashboard-contributions">
          <div className="dashboard-section__header">
            <div>
              <p className="dashboard-section__eyebrow">
                Contributions
              </p>

              <h2>
                Recent contributions
              </h2>
            </div>

            <Link
              to="/contributions"
              className="dashboard-section__link"
            >
              View all →
            </Link>
          </div>

          {contributions.length === 0 ? (
            <div className="dashboard-empty">
              <p>
                You haven't submitted any
                contributions yet.
              </p>

              <Link
                to="/requests"
                className="dashboard-action-button"
              >
                Find Requests
              </Link>
            </div>
          ) : (
            <div className="dashboard-list">
              {contributions
                .slice(0, 3)
                .map((contribution) => (
                  <Link
                    key={contribution.id}
                    to={`/contributions/${contribution.id}`}
                    className="dashboard-list-item"
                  >
                    <div>
                      <strong>
                        {contribution.file_name ||
                          `Contribution #${contribution.id}`}
                      </strong>

                      <span>
                        {contribution.status ||
                          "Submitted"}
                      </span>
                    </div>

                    <span>→</span>
                  </Link>
                ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <div>
              <p className="dashboard-section__eyebrow">
                Datasets
              </p>

              <h2>
                Available datasets
              </h2>
            </div>

            <Link
              to="/datasets"
              className="dashboard-section__link"
            >
              View all →
            </Link>
          </div>

          {datasets.length === 0 ? (
            <div className="dashboard-empty">
              <p>
                No datasets are currently available.
              </p>

              <Link
                to="/datasets/create"
                className="dashboard-action-button"
              >
                Create Dataset
              </Link>
            </div>
          ) : (
            <div className="dashboard-list">
              {datasets
                .slice(0, 3)
                .map((dataset) => (
                  <Link
                    key={dataset.id}
                    to={`/datasets/${dataset.id}`}
                    className="dashboard-list-item"
                  >
                    <div>
                      <strong>
                        {dataset.title}
                      </strong>

                      <span>
                        {dataset.visibility}
                      </span>
                    </div>

                    <span>→</span>
                  </Link>
                ))}
            </div>
          )}
        </section>
      </div>
            <section className="dashboard-section dashboard-activity">
        <div className="dashboard-section__header">
          <div>
            <p className="dashboard-section__eyebrow">
              Activity
            </p>

            <h2>Recent Activity</h2>
          </div>
        </div>

        <div className="dashboard-activity-list">
          {[
            ...requests.slice(0, 3).map((request) => ({
              type: "Request",
              title: request.title,
              status: request.status || "Draft",
              link: `/requests/${request.id}`,
            })),

            ...contributions.slice(0, 3).map(
              (contribution) => ({
                type: "Contribution",
                title:
                  contribution.file_name ||
                  `Contribution #${contribution.id}`,
                status:
                  contribution.status || "Submitted",
                link: `/contributions/${contribution.id}`,
              })
            ),

            ...datasets.slice(0, 3).map((dataset) => ({
              type: "Dataset",
              title: dataset.title,
              status:
                dataset.visibility || "Available",
              link: `/datasets/${dataset.id}`,
            })),
          ]
            .slice(0, 6)
            .map((activity, index) => (
              <Link
                key={`${activity.type}-${index}`}
                to={activity.link}
                className="dashboard-activity-item"
              >
                <div className="dashboard-activity-dot" />

                <div className="dashboard-activity-content">
                  <span className="dashboard-activity-type">
                    {activity.type}
                  </span>

                  <strong>
                    {activity.title}
                  </strong>

                  <span>
                    {activity.status}
                  </span>
                </div>

                <span className="dashboard-activity-arrow">
                  →
                </span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;