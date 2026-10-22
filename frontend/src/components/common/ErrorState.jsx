import "./ErrorState.css";
function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information.",
  onRetry,
}) {
  return (
    <div className="error-state">
      <h2>{title}</h2>
      <p>{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;