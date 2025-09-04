import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const pineconeIndex = pinecone.index('knowledge-search');

export const upsertVectors = async (vectors: Array<{
  id: string;
  values: number[];
  metadata: Record<string, string | number | boolean>;
}>) => {
  try {
    const upsertResponse = await pineconeIndex.upsert(vectors);
    return upsertResponse;
  } catch (error) {
    console.error('Error upserting vectors to Pinecone:', error);
    throw error;
  }
};

export const queryVectors = async (queryVector: number[], topK: number = 5, filter?: Record<string, string | number | boolean>) => {
  try {
    const queryResponse = await pineconeIndex.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      filter,
    });
    return queryResponse;
  } catch (error) {
    console.error('Error querying vectors from Pinecone:', error);
    throw error;
  }
};

export const deleteVectors = async (ids: string[]) => {
  try {
    const deleteResponse = await pineconeIndex.deleteMany(ids);
    return deleteResponse;
  } catch (error) {
    console.error('Error deleting vectors from Pinecone:', error);
    throw error;
  }
};

export default pinecone;
