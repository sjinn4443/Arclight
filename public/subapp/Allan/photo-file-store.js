(function attachAllanPhotoFileStore(globalObj) {
  const DEFAULT_CAPTURE_TYPES = ["limb", "close", "dermoscope"];
  const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const DEFAULT_MAX_FILE_SIZE = 12 * 1024 * 1024;

  function createPhotoFileStore(options = {}) {
    const captureTypes = [
      ...new Set(options.captureTypes || DEFAULT_CAPTURE_TYPES),
    ];
    const acceptedTypes = new Set(
      options.acceptedTypes || DEFAULT_ACCEPTED_TYPES,
    );
    const maxFileSize = Number(options.maxFileSize) || DEFAULT_MAX_FILE_SIZE;
    const urlApi = options.urlApi || globalObj.URL;
    const entries = Object.fromEntries(
      captureTypes.map((type) => [type, { file: null, objectUrl: "" }]),
    );

    function hasType(type) {
      return Object.hasOwn(entries, type);
    }

    function getFile(type) {
      return hasType(type) ? entries[type].file : null;
    }

    function getObjectUrl(type) {
      return hasType(type) ? entries[type].objectUrl : "";
    }

    function validate(file) {
      if (!file || !Number.isFinite(file.size) || file.size <= 0)
        return "Image is empty. Choose another photo.";
      if (!acceptedTypes.has(file?.type)) {
        return "Use a JPEG, PNG or WebP image.";
      }
      if (file.size > maxFileSize) {
        return "Image is too large. Use a file under 12 MB.";
      }
      return "";
    }

    function replace(type, file) {
      if (!hasType(type) || !file) return "";

      const objectUrl = urlApi.createObjectURL(file);
      const previousUrl = entries[type].objectUrl;
      if (previousUrl) {
        urlApi.revokeObjectURL(previousUrl);
      }

      entries[type] = { file, objectUrl };
      return objectUrl;
    }

    function clear() {
      captureTypes.forEach((type) => {
        const objectUrl = entries[type].objectUrl;
        if (objectUrl) {
          urlApi.revokeObjectURL(objectUrl);
        }
        entries[type] = { file: null, objectUrl: "" };
      });
    }

    return Object.freeze({
      clear,
      getFile,
      getObjectUrl,
      replace,
      validate,
    });
  }

  globalObj.ALLAN_PHOTO_FILE_STORE = Object.freeze({ createPhotoFileStore });
})(typeof window !== "undefined" ? window : globalThis);
