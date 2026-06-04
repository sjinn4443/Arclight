export const IMAGE_SET_QUERY_PARAM = 'images';
export const MOBILE_IMAGE_MAX_VIEWPORT_EDGE = 1100;

export function resolveImageAssetSet({
  imageAssetSets,
  queryValue,
  hasCoarsePointer,
  viewportEdge
}) {
  const normalizedQueryValue =
    typeof queryValue === 'string' ? queryValue.trim().toLowerCase() : '';
  if (normalizedQueryValue === 'full') {
    return imageAssetSets.full;
  }
  if (normalizedQueryValue === 'mobile') {
    return imageAssetSets.mobile;
  }

  const safeViewportEdge = Number.isFinite(Number(viewportEdge)) ? Number(viewportEdge) : 0;
  const shouldUseMobileAssets =
    Boolean(hasCoarsePointer) || safeViewportEdge <= MOBILE_IMAGE_MAX_VIEWPORT_EDGE;
  return shouldUseMobileAssets ? imageAssetSets.mobile : imageAssetSets.full;
}

export function buildTimedImagesFromSet(imageSet, fallbackTimedImages) {
  if (!imageSet || typeof imageSet !== 'object') {
    return fallbackTimedImages;
  }

  return [
    { src: imageSet.normal || fallbackTimedImages[0].src, label: 'normal' },
    { src: imageSet.suspicious || fallbackTimedImages[1].src, label: 'suspicious' },
    { src: imageSet.swollen || fallbackTimedImages[2].src, label: 'swollen' }
  ];
}

export function applyConditionButtonImageSet(imageSet, conditionButtons) {
  if (!imageSet || typeof imageSet !== 'object') {
    return;
  }

  conditionButtons.forEach((button) => {
    const condition = button.getAttribute('data-condition');
    const nextSource = imageSet[condition];
    if (typeof nextSource === 'string' && nextSource.length > 0) {
      button.setAttribute('data-image', nextSource);
    }
  });
}
