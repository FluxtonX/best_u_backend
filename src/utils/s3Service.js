const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy_secret',
  },
});

/**
 * Generates a pre-signed URL for uploading a file to S3 directly from the client.
 * @param {string} fileName - The name of the file (e.g., 'video-123.mp4')
 * @param {string} fileType - The MIME type of the file (e.g., 'video/mp4')
 * @returns {Promise<{uploadUrl: string, fileUrl: string}>}
 */
const generatePresignedUploadUrl = async (fileName, fileType) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || 'best-u-media';
  
  // Clean filename to prevent weird characters in S3
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Create a unique key (folder structure: bestu/videos/timestamp_filename)
  const key = `bestu/videos/${Date.now()}_${cleanFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    // Optional: ACL can be 'public-read' if the bucket allows it, 
    // but usually better to serve via CloudFront or signed GET urls.
    // We'll assume the bucket policy allows public read for this 'media/' path.
  });

  // URL expires in 15 minutes (900 seconds)
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  
  // The final URL where the file will reside
  const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
};

module.exports = {
  generatePresignedUploadUrl,
};
