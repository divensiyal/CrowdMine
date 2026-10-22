import { useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { addSchemaField } from "../../services/api/schema";
import "./SchemaBuilderPage.css";

function SchemaBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestId = searchParams.get("requestId");

  const [fields, setFields] = useState([
    {
      id: Date.now(),
      field_name: "",
      data_type: "text",
      is_required: true,
    },
  ]);

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function addField() {
    setFields((previous) => [
      ...previous,
      {
        id: Date.now(),
        field_name: "",
        data_type: "text",
        is_required: true,
      },
    ]);
  }

  function removeField(id) {
    setFields((previous) =>
      previous.filter((field) => field.id !== id)
    );
  }

  function updateField(id, key, value) {
    setFields((previous) =>
      previous.map((field) =>
        field.id === id
          ? { ...field, [key]: value }
          : field
      )
    );

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!requestId) {
      setError("Request ID is missing.");
      return;
    }

    const invalidField = fields.find(
      (field) => !field.field_name.trim()
    );

    if (invalidField) {
      setError("Please enter a name for every field.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      for (const field of fields) {
        await addSchemaField(requestId, {
          field_name: field.field_name.trim(),
          data_type: field.data_type,
          is_required: field.is_required,
        });
      }

      console.log("Schema saved successfully.");

      navigate(`/requests/${requestId}`);
    } catch (error) {
      console.error("Schema creation failed:", error);

      setError(
        error.message || "Unable to save the schema."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="schema-page">
      <div className="schema-header">
        <div>
          <Link
            to="/requests"
            className="schema-back"
          >
            ← Back to Requests
          </Link>

          <p className="schema-eyebrow">
            Request Setup
          </p>

          <h1>Define Your Data Schema</h1>

          <p className="schema-description">
            Define the fields that contributors will provide
            for each data contribution.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="schema-section">
          <div className="schema-section-header">
            <div>
              <h2>Data Fields</h2>

              <p>
                Add the fields required for each contribution.
              </p>
            </div>

            <button
              type="button"
              className="schema-add-button"
              onClick={addField}
            >
              + Add Field
            </button>
          </div>

          <div className="schema-fields">
            {fields.map((field, index) => (
              <div
                className="schema-field"
                key={field.id}
              >
                <div className="schema-field-number">
                  {index + 1}
                </div>

                <div className="schema-field-content">
                  <div className="schema-field-grid">
                    <div className="form-group">
                      <label
                        htmlFor={`name-${field.id}`}
                      >
                        Field Name
                      </label>

                      <input
                        id={`name-${field.id}`}
                        type="text"
                        placeholder="e.g. Image URL"
                        value={field.field_name}
                        onChange={(event) =>
                          updateField(
                            field.id,
                            "field_name",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor={`type-${field.id}`}
                      >
                        Data Type
                      </label>

                      <select
                        id={`type-${field.id}`}
                        value={field.data_type}
                        onChange={(event) =>
                          updateField(
                            field.id,
                            "data_type",
                            event.target.value
                          )
                        }
                      >
                        <option value="text">
                          Text
                        </option>

                        <option value="number">
                          Number
                        </option>

                        <option value="boolean">
                          Boolean
                        </option>

                        <option value="date">
                          Date
                        </option>

                        <option value="url">
                          URL
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="schema-field-footer">
                    <label className="required-toggle">
                      <input
                        type="checkbox"
                        checked={field.is_required}
                        onChange={(event) =>
                          updateField(
                            field.id,
                            "is_required",
                            event.target.checked
                          )
                        }
                      />

                      Required field
                    </label>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="schema-remove-button"
                        onClick={() =>
                          removeField(field.id)
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="create-request-error">
            {error}
          </p>
        )}

        <div className="schema-actions">
          <Link
            to="/requests"
            className="schema-cancel-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="schema-submit-button"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving Schema..."
              : "Save Schema"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SchemaBuilderPage;