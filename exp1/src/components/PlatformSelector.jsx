export default function PlatformSelector({ platforms, selectedPlatforms, onToggle }) {
  return (
    <div className="section-block">
      <div className="section-heading">
        <h2>Choose platforms</h2>
        <p>Select one or more platforms. The strictest limit applies.</p>
      </div>

      <div className="platform-grid">
        {platforms.map((platform) => {
          const active = selectedPlatforms.includes(platform.id);

          return (
            <button
              key={platform.id}
              type="button"
              className={`platform-card ${active ? 'active' : ''}`}
              onClick={() => onToggle(platform.id)}
              aria-pressed={active}
            >
              <span className="platform-name">{platform.label}</span>
              <span className="platform-limit">Limit: {platform.limit.toLocaleString()}</span>
              <span className="platform-tone">{platform.tone}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}