import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "제목은 필수입니다"],
      trim: true,
      maxlength: [200, "제목은 200자를 초과할 수 없습니다"],
    },
    content: {
      type: String,
      required: [true, "내용은 필수입니다"],
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ createdAt: -1 });

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
