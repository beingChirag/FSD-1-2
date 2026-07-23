export default function CharacterCounter({ textLength, activeLimit, tone }) {
  const progress = activeLimit ? Math.min((textLength / activeLimit) * 100, 100) : 0;

  let meterClass = 'meter-fill';
  if (activeLimit && textLength > activeLimit) {
    meterClass += ' danger';
  } else if (activeLimit && textLength >= activeLimit * 0.85) {
    meterClass += ' warning';
  }

  return (
    <div className="counter-panel">
      <div className="counter-row">
        <span>Character count</span>
        <strong>
          {textLength}
          {activeLimit ? ` / ${activeLimit}` : ' / --'}
        </strong>
      </div>
      <div className="meter-track" aria-hidden="true">
        <div className={meterClass} style={{ width: `${progress}%` }} />
      </div>
      <p className="counter-tone">{tone}</p>
    </div>
  );
}