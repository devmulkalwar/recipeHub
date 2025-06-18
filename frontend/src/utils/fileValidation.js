/**
 * Validates an image file for size and type
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default 5MB)
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validateImageFile = (file, maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size should be less than ${Math.floor(maxSize / (1024 * 1024))}MB`
    };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a valid image file (JPEG, JPG, PNG, or WEBP)'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Gets the file extension from a file object or filename
 * @param {File|string} file - File object or filename
 * @returns {string} - File extension
 */
export const getFileExtension = (file) => {
  const filename = typeof file === 'string' ? file : file.name;
  return filename.split('.').pop().toLowerCase();
};

/**
 * Formats file size to human readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
