import { useEffect, useState } from "react";

import {
  getCurrentUser,
  updateCurrentUser,
} from "../../services/api/users";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import "./ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await getCurrentUser();

        setUser(response);
        setUsername(response.username || "");
        setEmail(response.email || "");
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        setError(
          error.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateCurrentUser({
        username,
        email,
      });

      setUser(response);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      setError(
        error.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !user) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <p className="profile-eyebrow">
          CrowdMine
        </p>

        <h1>Profile</h1>

        <p className="profile-description">
          Manage your CrowdMine account information.
        </p>
      </div>

      {error && (
        <div className="profile-message profile-message--error">
          {error}
        </div>
      )}

      {success && (
        <div className="profile-message profile-message--success">
          {success}
        </div>
      )}

      <section className="profile-card">
        <div className="profile-card-header">
          <div>
            <h2>Account Information</h2>

            <p>
              Update the information associated with
              your account.
            </p>
          </div>
        </div>

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          <div className="profile-field">
            <label htmlFor="profile-username">
              Username
            </label>

            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
            />
          </div>

          <div className="profile-field">
            <label htmlFor="profile-email">
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="profile-form-actions">
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {user?.id && (
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Account ID</h2>

              <p>
                Your internal CrowdMine user
                identifier.
              </p>
            </div>
          </div>

          <div className="profile-account-id">
            #{user.id}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProfilePage;