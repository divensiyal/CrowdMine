import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getRequest,
  publishRequest,
  closeRequest,
} from "../../services/api/requests";

import { getSchemaFields } from "../../services/api/schema";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./RequestDetailsPage.css";

function RequestDetailsPage() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [schema, setSchema] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    async function loadRequest() {
      try {
        setLoading(true);
        setError("");

        const requestData = await getRequest(id);
        const schemaData = await getSchemaFields(id);

        setRequest(requestData);
        setSchema(schemaData);
      } catch (error) {
        console.error("Failed to load request:", error);

        setError(
          error.message || "Unable to load request."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id]);

  async function handlePublish() {
    try {
      setIsUpdatingStatus(true);
      setError("");

      const response = await publishRequest(id);

      setRequest((previous) => ({
        ...previous,
        ...response,
        status: "published",
      }));
    } catch (error) {
      console.error(
        "Failed to publish request:",
        error
      );

      setError(
        error.message || "Unable to publish the request."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleClose() {
    try {
      setIsUpdatingStatus(true);
      setError("");

      const response = await closeRequest(id);

      setRequest((previous) => ({
        ...previous,
        ...response,
        status: "closed",
      }));
    } catch (error) {
      console.error(
        "Failed to close request:",
        error
      );

      setError(
        error.message || "Unable to close the request."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !request) {
    return <ErrorState message={error} />;
  }

  if (!request) {
    return (
      <ErrorState message="Request could not be found." />
    );
  }

  return (
    <div className="request-details-page">
      {/* Header */}
      <div className="request-details-header">
        <div>
          <Link
            to="/requests"
            className="request-details-back"
          >
            ← Back to Requests
          </Link>

          <p className="request-details-eyebrow">
            Data Request
          </p>

          <h1>{request.title}</h1>

          <p className="request-details-description">
            {request.description ||
              "No description provided."}
          </p>

          {/* Request Actions */}
          <div className="request-details-actions">

            {/* Edit Request */}
            <Link
              to={`/requests/${id}/edit`}
              className="request-edit-button"
            >
              Edit Request
            </Link>

            {/* Draft → Publish */}
            {request.status === "draft" && (
              <button
                type="button"
                className="request-publish-button"
                onClick={handlePublish}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus
                  ? "Publishing..."
                  : "Publish Request"}
              </button>
            )}

            {/* Published → Close + Contribute */}
            {request.status === "published" && (
              <>
                <button
                  type="button"
                  className="request-close-button"
                  onClick={handleClose}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus
                    ? "Closing..."
                    : "Close Request"}
                </button>

                <Link
                  to={`/requests/${id}/contribute`}
                  className="request-contribute-button"
                >
                  Contribute Data
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error after request has loaded */}
      {error && (
        <p className="create-request-error">
          {error}
        </p>
      )}

      {/* Request Summary */}
      <div className="request-details-grid">
        <div className="request-details-card">
          <span>Request ID</span>

          <strong>
            #{request.id || id}
          </strong>
        </div>

        <div className="request-details-card">
          <span>Target Records</span>

          <strong>
            {request.target_records}
          </strong>
        </div>

        <div className="request-details-card">
          <span>Status</span>

          <strong>
            {request.status || "Draft"}
          </strong>
        </div>
      </div>

      {/* Schema */}
      <section className="request-schema-section">
        <div className="request-section-header">
          <div>
            <h2>Data Schema</h2>

            <p>
              Fields required for each contribution.
            </p>
          </div>
        </div>

        {schema.length === 0 ? (
          <div className="request-schema-empty">
            No schema fields have been added.
          </div>
        ) : (
          <div className="request-schema-table">

            {/* Table Header */}
            <div className="schema-table-header">
              <span>Field Name</span>

              <span>Data Type</span>

              <span>Required</span>
            </div>

            {/* Table Rows */}
            {schema.map((field) => (
              <div
                className="schema-table-row"
                key={
                  field.id ||
                  field.field_id
                }
              >
                <span>
                  {field.field_name}
                </span>

                <span>
                  {field.data_type}
                </span>

                <span>
                  {field.is_required
                    ? "Yes"
                    : "No"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RequestDetailsPage;