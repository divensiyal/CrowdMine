import "./EmptyState.css";
function EmptyState({
  title = "Nothing here yet",
  message = "There is no information to display.",
  action,
}) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{message}</p>

      {action && (
        <button type="button" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;