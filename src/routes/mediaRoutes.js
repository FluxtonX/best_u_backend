const express = require('express');
const { getUploadUrl } = require('../controllers/mediaController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/upload-url', getUploadUrl);

module.exports = router;
