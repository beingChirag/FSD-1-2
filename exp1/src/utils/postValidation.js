export function getActiveLimit(selectedPlatforms, platformOptions) {
  if (selectedPlatforms.length === 0) {
    return null;
  }

  const selectedLimits = platformOptions
    .filter((platform) => selectedPlatforms.includes(platform.id))
    .map((platform) => platform.limit);

  return Math.min(...selectedLimits);
}

export function validateImage(file) {
  if (!file) {
    return '';
  }

  if (!file.type.startsWith('image/')) {
    return 'Please upload a valid image file.';
  }

  return '';
}

export function buildValidationState({ text, selectedPlatforms, imageFile, platformOptions }) {
  const trimmedText = text.trim();
  const activeLimit = getActiveLimit(selectedPlatforms, platformOptions);
  const imageError = validateImage(imageFile);
  const issues = [];

  if (selectedPlatforms.length === 0) {
    issues.push('Select at least one platform to validate your post.');
  }

  if (trimmedText.length === 0) {
    issues.push('Write a post before publishing.');
  }

  if (activeLimit !== null && trimmedText.length > activeLimit) {
    issues.push(`Your post is ${trimmedText.length - activeLimit} character(s) over the limit for the selected platform(s).`);
  }

  if (imageError) {
    issues.push(imageError);
  }

  return {
    activeLimit,
    textLength: trimmedText.length,
    imageError,
    issues,
    canPost: issues.length === 0,
  };
}

export function getCounterTone(textLength, activeLimit) {
  if (!activeLimit) {
    return 'Select platforms to see the active character limit.';
  }

  const remaining = activeLimit - textLength;

  if (remaining < 0) {
    return `${Math.abs(remaining)} character(s) over the limit.`;
  }

  if (remaining <= 20) {
    return 'You are very close to the limit.';
  }

  if (remaining <= activeLimit * 0.2) {
    return 'You are nearing the limit.';
  }

  return 'You have room to add more details.';
}