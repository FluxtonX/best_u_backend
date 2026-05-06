require('dotenv').config();
const { generatePresignedUploadUrl } = require('./src/utils/s3Service');

async function testS3() {
  console.log("Testing AWS S3 Pre-signed URL Generation...");
  try {
    const { uploadUrl, fileUrl } = await generatePresignedUploadUrl('test-video.mp4', 'video/mp4');
    
    console.log("\n✅ Success!");
    console.log("--------------------------------------------------");
    console.log("Upload URL (for Flutter to PUT the file):");
    console.log(uploadUrl);
    console.log("--------------------------------------------------");
    console.log("Permanent File URL (to save in DB):");
    console.log(fileUrl);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("❌ Failed to generate URL:", error.message);
  }
}

testS3();
