import mongoose, { model, models, Schema, Document } from "mongoose";

export interface IImage extends Document {
  url: string;
  publicId: string;
  userId?: mongoose.Types.ObjectId;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const imageSchema = new Schema<IImage>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    width: Number,
    height: Number,
    format: String,
    size: Number,
  },
  {
    timestamps: true,
  }
);

const Image = models?.Image || model<IImage>("Image", imageSchema);

export default Image;
