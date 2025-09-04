import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import { getUserIdFromRequest } from '@/lib/auth';
import { deleteFromS3 } from '@/lib/s3';
import { deleteVectors } from '@/lib/pinecone';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const document = await Document.findOne({ _id: id, userId });
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete from S3
    await deleteFromS3(document.s3Key);

    // Delete from Pinecone
    await deleteVectors(document.pineconeIds);

    // Delete from MongoDB
    await Document.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
