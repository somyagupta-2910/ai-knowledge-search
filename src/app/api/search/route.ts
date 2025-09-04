import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { generateEmbedding, generateAnswer } from '@/lib/openai';
import { queryVectors } from '@/lib/pinecone';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search in Pinecone
    const searchResults = await queryVectors(
      queryEmbedding,
      10, // topK
      { userId: userId } // filter by user
    );

    if (!searchResults.matches || searchResults.matches.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find any relevant information in your knowledge base to answer this question.",
        confidence: 0,
        completeness: 0,
        suggestions: [
          "Upload documents related to this topic",
          "Try rephrasing your question",
          "Check if the documents are properly processed"
        ],
        sources: []
      });
    }

    // Extract context from search results
    const context = searchResults.matches.map(match => 
      match.metadata?.content || ''
    ).filter((content): content is string => typeof content === 'string' && content.length > 0);

    // Generate AI answer with confidence and completeness assessment
    const aiResponse = await generateAnswer(query, context);

    // Prepare sources
    const sources = searchResults.matches.map(match => ({
      filename: match.metadata?.filename || 'Unknown',
      content: match.metadata?.content || '',
      score: match.score || 0
    }));

    return NextResponse.json({
      answer: aiResponse.answer,
      confidence: aiResponse.confidence,
      completeness: aiResponse.completeness,
      suggestions: aiResponse.suggestions,
      sources
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to process search query' },
      { status: 500 }
    );
  }
}
