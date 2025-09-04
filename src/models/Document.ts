import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  s3Key: string;
  s3Url: string;
  fileType: string;
  fileSize: number;
  content: string;
  embeddings: number[][];
  pineconeIds: string[];
  uploadedAt: Date;
  processedAt?: Date;
}

const DocumentSchema = new Schema<IDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
  },
  s3Url: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'doc', 'txt'],
  },
  fileSize: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  embeddings: {
    type: [[Number]],
    required: true,
  },
  pineconeIds: {
    type: [String],
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
});

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
