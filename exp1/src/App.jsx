import { useEffect, useMemo, useState } from 'react';
import CharacterCounter from './components/CharacterCounter';
import ImageUploader from './components/ImageUploader';
import PlatformSelector from './components/PlatformSelector';
import ValidationSummary from './components/ValidationSummary';
import { platformOptions } from './data/platforms';
import { buildValidationState, getCounterTone } from './utils/postValidation';

const initialFormState = {
  text: '',
  selectedPlatforms: ['twitter'],
  imageFile: null,
  imagePreview: '',
};

export default function App() {
  const [text, setText] = useState(initialFormState.text);
  const [selectedPlatforms, setSelectedPlatforms] = useState(initialFormState.selectedPlatforms);
  const [imageFile, setImageFile] = useState(initialFormState.imageFile);
  const [imagePreview, setImagePreview] = useState(initialFormState.imagePreview);
  const [submittedMessage, setSubmittedMessage] = useState('');

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return undefined;
    }

    const nextPreview = URL.createObjectURL(imageFile);
    setImagePreview(nextPreview);

    return () => URL.revokeObjectURL(nextPreview);
  }, [imageFile]);

  const validation = useMemo(
    () =>
      buildValidationState({
        text,
        selectedPlatforms,
        imageFile,
        platformOptions,
      }),
    [text, selectedPlatforms, imageFile],
  );

  const counterTone = getCounterTone(validation.textLength, validation.activeLimit);

  function handlePlatformToggle(platformId) {
    setSubmittedMessage('');

    setSelectedPlatforms((current) =>
      current.includes(platformId)
        ? current.filter((id) => id !== platformId)
        : [...current, platformId],
    );
  }

  function handleImageChange(event) {
    setSubmittedMessage('');
    const nextFile = event.target.files?.[0] ?? null;
    setImageFile(nextFile);
  }

  function handleClearImage() {
    setSubmittedMessage('');
    setImageFile(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validation.canPost) {
      return;
    }

    setSubmittedMessage('Post ready for publishing. This demo keeps the submission local.');
  }

  const activePlatformLabels = platformOptions
    .filter((platform) => selectedPlatforms.includes(platform.id))
    .map((platform) => platform.label)
    .join(', ');

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Dynamic Multi-Platform Post Composer</p>
          <h1>Write once, validate for every platform.</h1>
          <p className="hero-text">
            Compose a post, attach an image, and instantly see whether it fits Twitter / X,
            Instagram, Facebook, and LinkedIn.
          </p>
        </div>

        <form className="composer-grid" onSubmit={handleSubmit}>
          <div className="composer-card">
            <label className="field-label" htmlFor="postText">
              Post text
            </label>
            <textarea
              id="postText"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Share your update, idea, or announcement here..."
              rows={8}
            />

            <CharacterCounter
              textLength={validation.textLength}
              activeLimit={validation.activeLimit}
              tone={counterTone}
            />
          </div>

          <PlatformSelector
            platforms={platformOptions}
            selectedPlatforms={selectedPlatforms}
            onToggle={handlePlatformToggle}
          />

          <ImageUploader
            file={imageFile}
            previewUrl={imagePreview}
            error={validation.imageError}
            onChange={handleImageChange}
            onClear={handleClearImage}
          />

          <ValidationSummary issues={validation.issues} canPost={validation.canPost} />

          <div className="footer-bar">
            <div>
              <span className="footer-label">Selected platforms</span>
              <strong>{activePlatformLabels || 'None selected'}</strong>
            </div>

            <button type="submit" className="post-button" disabled={!validation.canPost}>
              Post
            </button>
          </div>

          {submittedMessage ? <p className="success-note">{submittedMessage}</p> : null}
        </form>
      </section>
    </main>
  );
}