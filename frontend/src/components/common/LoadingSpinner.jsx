import "./LoadingSpinner.css";
function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;