import Posts from "../models/postmodels.js";

import User from "../models/usermodels.js";

export const getPosts = async (req, res) => {
  try {
    let query = JSON.stringify(req.query);

    //ama bo awaya la req.query kaya bysrynawa boy find ka eshkat
    let excluteQuery = [
      "sort",
      "fields",
      "page",
      "limit",
      "search",
      "id",
      "user",
    ];
    //bo nwsyny gte ...
    query = query.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    let queryObj = JSON.parse(query);
    excluteQuery.forEach((i) => {
      delete queryObj[i];
    });

    if (req.query.search) {
      queryObj.fullName = new RegExp(req.query.search, "i");
    }

    if (req.query.id) {
      queryObj._id = req.query.id;
    }
    if (req.query.userId) {
      const user = await User.findOne({ userName: req.query.userName });
      if (user) {
        queryObj.user = user._id;
      }
    }

    const getQuery = Posts.find(queryObj).populate(
      "userId",
      "firstName lastName image"
    );

    const count = await getQuery.clone().count();

    //bo sort krdna
    if (req.query.sort) {
      getQuery.sort(req.query.sort);
    }
    //id

    //ama bo awaya ka tanha datay aw row wana bgarenetawa ka yawtate bo nmwna name image price
    if (req.query.fields) {
      getQuery.select(req.query.fields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 15;

    const skip = limit * (page - 1);

    getQuery.skip(skip).limit(limit);
    const Post = await getQuery;

    res.status(200).json({
      stastus: "success",
      NumberOfData: count,
      data: Post,
    });
  } catch (err) {
    res.status(404).json({ stastus: "error", message: "Post not found" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.headers.id; // Access the id from the request header
    const updatedPost = req.body;

    const post = await Posts.findByIdAndUpdate(postId, updatedPost, {
      new: true,
    });

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    res.status(200).json({ status: "success", data: post });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const addPost = async (req, res) => {
  try {
    const data = await Posts.create(req.body);

    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { post: data._id } },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      data: data,
      user: user,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const PostId = req.params.id;

    // Find the Post by ID and delete it
    const deletedPost = await Posts.findByIdAndDelete(PostId);

    if (!deletedPost) {
      // If the Post is not found, return an error response
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    // Remove the Post reference from related models (e.g., brand and category)
    await User.updateOne(
      { _id: deletedPost.post },
      { $pull: { Post: deletedPost._id } }
    );

    // Return success response
    res
      .status(200)
      .json({ status: "success", message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
