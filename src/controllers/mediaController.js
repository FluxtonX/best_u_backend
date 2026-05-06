const { generatePresignedUploadUrl } = require('../utils/s3Service');

// @desc    Get AWS S3 Pre-signed URL for direct upload
// @route   GET /api/v1/media/upload-url
// @access  Private
const getUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res.status(400).json({ 
        success: false, 
        message: 'fileName and fileType query parameters are required' 
      });
    }

    const { uploadUrl, fileUrl } = await generatePresignedUploadUrl(fileName, fileType);

    res.status(200).json({
      success: true,
      data: {
        uploadUrl,
        fileUrl,
      }
    });
  } catch (error) {
    console.error('S3 Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate upload URL' });
  }
};

module.exports = {
  getUploadUrl,
};
