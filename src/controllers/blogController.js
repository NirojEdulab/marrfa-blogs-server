const { default: mongoose } = require('mongoose');
const Blog = require('../models/blog');
const cloudinary = require('../utils/cloudinary');

exports.createBlog = async (req, res) => {
  const { title, content, categories } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'marrfa-blogs', // Optional: Specify a folder in Cloudinary
    });

    // Create blog with Cloudinary image details
    const blog = new Blog({
      title,
      content,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      author: req.user.email,
      categories: Array.isArray(categories) ? categories : [],
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog', error: error.message });
  }
};

exports.getBlogDetails = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    // Find the blog by its ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog details fetched successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog details', error: error.message });
  }
};
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findOneAndDelete({ _id: id, author: req.user.email });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or not authorized' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(blog.publicId);

    res.status(200).json({ message: 'Blog and associated image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blog', error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Retrieve all blogs
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};