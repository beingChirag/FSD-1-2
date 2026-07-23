export default function ImageUploader({ file, previewUrl, error, onChange, onClear }) {
  return (
    <div className="section-block">
      <div className="section-heading">
        <h2>Add an image</h2>
        <p>Image uploads are optional, but supported for visual posts.</p>
      </div>

      <label className="upload-card">
        <input type="file" accept="image/*" onChange={onChange} />
        <span className="upload-title">Drop or choose an image</span>
        <span className="upload-note">PNG, JPG, WEBP, GIF</span>
      </label>

      {file ? (
        <div className="preview-card">
          <img src={previewUrl} alt="Selected preview" className="preview-image" />
          <div className="preview-meta">
            <div>
              <strong>{file.name}</strong>
              <p>{Math.round(file.size / 1024)} KB</p>
            </div>
            <button type="button" className="ghost-button" onClick={onClear}>
              Remove image
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}