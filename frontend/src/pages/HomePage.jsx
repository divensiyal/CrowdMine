import { Link } from "react-router-dom";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">

      {/* Hero */}

      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-eyebrow">
            CROWD-MINED DATA PLATFORM
          </p>

          <h1>
            Turn distributed data
            <br />
            into useful datasets.
          </h1>

          <p className="home-hero__description">
            CrowdMine connects people who need data
            with people who can contribute it.
            Create requests, collect contributions,
            and build datasets in one place.
          </p>

          <div className="home-hero__actions">
            <Link
              to="/register"
              className="home-primary-button"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="home-secondary-button"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>


      {/* How it works */}

      <section className="home-section">
        <div className="home-section__header">
          <p className="home-eyebrow">
            HOW IT WORKS
          </p>

          <h2>
            From request to dataset.
          </h2>

          <p>
            CrowdMine provides a structured flow for
            collecting and managing distributed data.
          </p>
        </div>

        <div className="home-process-grid">

          <div className="home-process-card">
            <span>01</span>

            <h3>
              Create a Request
            </h3>

            <p>
              Define what data you need and specify
              the fields contributors should provide.
            </p>
          </div>

          <div className="home-process-card">
            <span>02</span>

            <h3>
              Collect Contributions
            </h3>

            <p>
              Contributors discover requests and
              submit the required data.
            </p>
          </div>

          <div className="home-process-card">
            <span>03</span>

            <h3>
              Build Datasets
            </h3>

            <p>
              Collected data can be organized into
              datasets for further use.
            </p>
          </div>

        </div>
      </section>


      {/* Platform features */}

      <section className="home-section home-section--light">
        <div className="home-section__header">
          <p className="home-eyebrow">
            THE PLATFORM
          </p>

          <h2>
            Everything in one workflow.
          </h2>
        </div>

        <div className="home-feature-grid">

          <div className="home-feature-card">
            <h3>Data Requests</h3>

            <p>
              Create structured requests and define
              exactly what information is needed.
            </p>
          </div>

          <div className="home-feature-card">
            <h3>Contributions</h3>

            <p>
              Discover requests and submit data
              through the contribution workflow.
            </p>
          </div>

          <div className="home-feature-card">
            <h3>Datasets</h3>

            <p>
              Manage datasets created from collected
              data and control their visibility.
            </p>
          </div>

        </div>
      </section>


      {/* CTA */}

      <section className="home-cta">
        <p className="home-eyebrow">
          START WITH CROWDMINE
        </p>

        <h2>
          Have data to collect?
        </h2>

        <p>
          Create your first data request and start
          building your dataset.
        </p>

        <Link
          to="/register"
          className="home-primary-button"
        >
          Create Your Account
        </Link>
      </section>

    </div>
  );
}

export default HomePage;