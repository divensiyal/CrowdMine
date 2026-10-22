import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { discoverRequests } from "../../services/api/requests";
import { getSchemaFields } from "../../services/api/schema";
import { uploadContributionFile } from "../../services/api/uploads";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./ContributePage.css";

function ContributePage() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [schemaFields, setSchemaFields] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadContributionRequest() {
      try {
        setLoading(true);
        setError("");

        // Get requests available for contribution.
        const requests = await discoverRequests();

        const selectedRequest = requests.find(
          (request) => String(request.id) === String(id)
        );

        if (!selectedRequest) {
          throw new Error(
            "This request is not available for contribution."
          );
        }

        setRequest(selectedRequest);

        // Schema is a separate API resource.
        const fields = await getSchemaFields(Number(id));

        setSchemaFields(fields || []);
      } catch (error) {
        console.error(
          "Failed to load contribution request:",
          error
        );

        setError(
          error.message ||
            "Unable to load this contribution request."
        );
      } finally {
        setLoading(false);
      }
    }

    loadContributionRequest();
  }, [id]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setResult(null);

      const response = await uploadContributionFile(
        Number(id),
        selectedFile
      );

      setResult(response);
    } catch (error) {
      console.error(
        "Contribution upload failed:",
        error
      );

      setError(
        error.message ||
          "Unable to upload your contribution."
      );
    } finally {
      setUploading(false);
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
    <div className="contribute-page">
      <div className="contribute-header">
        <Link
          to="/requests"
          className="contribute-back"
        >
          ← Back to Requests
        </Link>

        <p className="contribute-eyebrow">
          Contribution
        </p>

        <h1>{request.title}</h1>

        <p className="contribute-description">
          {request.description ||
            "Provide the requested dataset for this request."}
        </p>
      </div>

      {error && (
        <div className="contribute-error">
          {error}
        </div>
      )}

      {result && (
        <div className="contribute-success">
          <strong>
            Contribution uploaded successfully.
          </strong>

          <p>
            Contribution ID:{" "}
            {result.contribution_id}
          </p>

          {result.validation && (
            <p>
              Validation:{" "}
              {result.validation.valid
                ? "Valid"
                : "Invalid"}
            </p>
          )}
        </div>
      )}

      <form
        className="contribute-form"
        onSubmit={handleSubmit}
      >
        <section className="contribute-card">
          <div className="contribute-section-header">
            <h2>Required Data</h2>

            <p>
              This request requires the following
              fields in your dataset.
            </p>
          </div>

          {schemaFields.length === 0 ? (
            <div className="contribute-empty">
              No schema fields have been defined
              for this request.
            </div>
          ) : (
            <div className="contribute-schema-list">
              {schemaFields.map((field) => (
                <div
                  className="contribute-schema-item"
                  key={
                    field.id ||
                    field.field_id ||
                    field.field_name
                  }
                >
                  <div>
                    <strong>
                      {field.field_name}
                    </strong>

                    {field.description && (
                      <p>
                        {field.description}
                      </p>
                    )}
                  </div>

                  <div className="contribute-schema-meta">
                    <span>
                      {field.data_type}
                    </span>

                    {field.is_required && (
                      <span>Required</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="contribute-card">
          <div className="contribute-section-header">
            <h2>Upload Dataset</h2>

            <p>
              Upload a file containing the requested
              data.
            </p>
          </div>

          <label
            htmlFor="contribution-file"
            className="contribute-upload-area"
          >
            <span className="contribute-upload-icon">
              ↑
            </span>

            <strong>
              {selectedFile
                ? selectedFile.name
                : "Choose a dataset file"}
            </strong>

            <span>
              {selectedFile
                ? `${(
                    selectedFile.size /
                    1024
                  ).toFixed(1)} KB`
                : "Click here to select your file"}
            </span>
          </label>

          <input
            id="contribution-file"
            type="file"
            className="contribute-file-input"
            onChange={handleFileChange}
          />
        </section>

        <div className="contribute-actions">
          <Link
            to="/requests"
            className="contribute-cancel"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="contribute-submit"
            disabled={
              uploading || !selectedFile
            }
          >
            {uploading
              ? "Uploading..."
              : "Upload Contribution"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContributePage;