import { NextRequest, NextResponse } from 'next/server';
import Document from '@/models/Document';
import { getUserIdFromRequest } from '@/lib/auth';
import { uploadToS3 } from '@/lib/s3';
import { parseDocument, getFileType } from '@/lib/documentParser';
import { generateEmbedding, chunkText } from '@/lib/openai';
import { upsertVectors } from '@/lib/pinecone';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileType = getFileType(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse document content
    const content = await parseDocument(buffer, file.name);
    
    // Upload to S3
    const s3Key = `documents/${userId}/${uuidv4()}-${file.name}`;
    const s3Url = await uploadToS3(buffer, s3Key, file.type);
    
    // Chunk the content
    const chunks = chunkText(content);
    
    // Generate embeddings for each chunk
    const embeddings = await Promise.all(
      chunks.map(chunk => generateEmbedding(chunk))
    );
    
    // Prepare vectors for Pinecone
    const vectors = chunks.map((chunk, index) => ({
      id: `${userId}-${uuidv4()}-${index}`,
      values: embeddings[index],
      metadata: {
        userId,
        filename: file.name,
        chunkIndex: index,
        content: chunk,
      },
    }));
    
    // Upload to Pinecone
    await upsertVectors(vectors);
    
    // Save document to MongoDB
    const document = new Document({
      userId,
      filename: file.name,
      originalName: file.name,
      s3Key,
      s3Url,
      fileType,
      fileSize: file.size,
      content,
      embeddings,
      pineconeIds: vectors.map(v => v.id),
      processedAt: new Date(),
    });
    
    await document.save();
    
    return NextResponse.json(
      { 
        message: 'Document uploaded successfully',
        document: {
          id: document._id,
          filename: document.filename,
          fileType: document.fileType,
          fileSize: document.fileSize,
          uploadedAt: document.uploadedAt,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
