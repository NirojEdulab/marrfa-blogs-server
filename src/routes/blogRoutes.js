const express = require('express');
// const { authenticate } = require('../middlewares/authenticate');
const { createBlog, deleteBlog, getAllBlogs, getBlogDetails } = require('../controllers/blogController');
const upload = require('../middlewares/upload');
// const kindeAuthMiddleware = require('../middlewares/kindeAuthMiddleware');
// const { protectRoute } = require('@kinde-oss/kinde-node-express');

const router = express.Router();

router.post('/', upload.single('image'), createBlog);
router.get('/', getAllBlogs);
router.get('/blog/:id', getBlogDetails);
router.delete('/:id', deleteBlog);

module.exports = router;
