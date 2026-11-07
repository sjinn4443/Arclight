// These files are authoring/preview outputs, not lesson dependencies.
// The diabetic workshop deliberately embeds the one retained Lottie demo.
function isOfflineAuthoringAsset(rawPath) {
  let asset;
  try {
    asset = decodeURIComponent(String(rawPath))
      .replaceAll("\\", "/")
      .replace(/^\/+/, "")
      .toLowerCase();
  } catch {
    return true;
  }
  if (asset.startsWith("js/__mocks__/")) return true;
  if (
    /^html\/(?:fundal_noback|fundal_singscreen|fundal_exam|fundal_reflex_ae)\.json$/.test(
      asset,
    )
  )
    return true;
  return (
    asset.startsWith("scrolly/") &&
    asset.includes("/demo/") &&
    !asset.startsWith("scrolly/coreexam/ophths/do/03howtoexamine/1/demo/")
  );
}
module.exports = { isOfflineAuthoringAsset };
