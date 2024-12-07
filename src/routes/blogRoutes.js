const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { createBlog, deleteBlog, getAllBlogs, getBlogDetails } = require('../controllers/blogController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', authenticate, upload.single('image'), createBlog);
router.get('/', getAllBlogs);
router.get('/blog/:id', authenticate, getBlogDetails);
router.delete('/:id', authenticate, deleteBlog);

module.exports = router;
