const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    user: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
