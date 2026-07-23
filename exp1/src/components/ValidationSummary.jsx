export default function ValidationSummary({ issues, canPost }) {
  return (
    <div className={`validation-summary ${canPost ? 'success' : 'error'}`}>
      <h3>{canPost ? 'Ready to post' : 'Fix the following'}</h3>
      {issues.length > 0 ? (
        <ul>
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : (
        <p>Your post meets the selected platform rules.</p>
      )}
    </div>
  );
}