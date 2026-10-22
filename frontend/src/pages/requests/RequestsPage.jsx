import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyRequests,
  discoverRequests,
} from "../../services/api/requests";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./RequestsPage.css";

function RequestCard({ request, ownRequest = false }) {
  const destination = ownRequest
    ? `/requests/${request.id}`
    : `/requests/${request.id}/contribute`;

  return (
    <Link
      to={destination}
      className="request-card"
    >
      <div className="request-card__content">
        <div className="request-card__top">
          <h2>{request.title}</h2>

          <span
            className={`request-card__status request-card__status--${request.status}`}
          >
            {request.status}
          </span>
        </div>

        <p>
          {request.description ||
            "No description provided."}
        </p>

        <div className="request-card__meta">
          <span>
            Target: {request.target_records}
          </span>

          <span>
            Request #{request.id}
          </span>

          {ownRequest && (
            <span className="request-card__owner-label">
              Your Request
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function RequestsPage() {
  const [myRequests, setMyRequests] = useState([]);
  const [discoverableRequests, setDiscoverableRequests] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setError("");

        const [myRequestsResponse, discoverResponse] =
          await Promise.all([
            getMyRequests(),
            discoverRequests(),
          ]);

        setMyRequests(myRequestsResponse || []);
        setDiscoverableRequests(discoverResponse || []);
      } catch (error) {
        console.error(
          "Failed to load requests:",
          error
        );

        setError(
          error.message ||
            "Unable to load requests."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const publishedMyRequests = myRequests.filter(
    (request) => request.status === "published"
  );

  const draftMyRequests = myRequests.filter(
    (request) => request.status === "draft"
  );

  const closedMyRequests = myRequests.filter(
    (request) => request.status === "closed"
  );

  return (
    <div className="requests-page">
      <div className="requests-header">
        <div>
          <p className="requests-eyebrow">
            CrowdMine
          </p>

          <h1>Requests</h1>

          <p className="requests-description">
            Manage your data requests and discover
            requests that need contributions.
          </p>
        </div>

        <Link
          to="/requests/create"
          className="requests-create-button"
        >
          Create Request
        </Link>
      </div>

      {/* MY REQUESTS */}

      <section className="requests-section">
        <div className="requests-section-header">
          <div>
            <h2>My Requests</h2>

            <p>
              Requests you have created.
            </p>
          </div>

          <span className="requests-section-count">
            {myRequests.length}
          </span>
        </div>

        {myRequests.length === 0 ? (
          <div className="requests-empty">
            <h3>No requests created yet</h3>

            <p>
              Create your first data request to start
              collecting contributions.
            </p>

            <Link
              to="/requests/create"
              className="requests-empty-button"
            >
              Create Request
            </Link>
          </div>
        ) : (
          <>
            {/* PUBLISHED */}

            {publishedMyRequests.length > 0 && (
              <div className="requests-subsection">
                <div className="requests-subsection-title">
                  Published
                </div>

                <div className="requests-list">
                  {publishedMyRequests.map(
                    (request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        ownRequest
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* DRAFT */}

            {draftMyRequests.length > 0 && (
              <div className="requests-subsection">
                <div className="requests-subsection-title">
                  Drafts
                </div>

                <div className="requests-list">
                  {draftMyRequests.map(
                    (request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        ownRequest
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* CLOSED */}

            {closedMyRequests.length > 0 && (
              <div className="requests-subsection">
                <div className="requests-subsection-title">
                  Closed
                </div>

                <div className="requests-list">
                  {closedMyRequests.map(
                    (request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        ownRequest
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* DISCOVER REQUESTS */}

      <section className="requests-section requests-discover-section">
        <div className="requests-section-header">
          <div>
            <h2>Discover Requests</h2>

            <p>
              Published requests from other CrowdMine
              users that need contributions.
            </p>
          </div>

          <span className="requests-section-count">
            {discoverableRequests.length}
          </span>
        </div>

        {discoverableRequests.length === 0 ? (
          <div className="requests-empty">
            <h3>No published requests available</h3>

            <p>
              There are currently no requests from
              other users available for contribution.
            </p>
          </div>
        ) : (
          <div className="requests-list">
            {discoverableRequests.map(
              (request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default RequestsPage;