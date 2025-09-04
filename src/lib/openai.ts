import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 512, // Specify 512 dimensions to match your Pinecone index
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

export const generateAnswer = async (
  query: string,
  context: string[]
): Promise<{
  answer: string;
  confidence: number;
  completeness: number;
  suggestions: string[];
}> => {
  try {
    const systemPrompt = `You are an AI assistant that provides accurate answers based on the provided context. 
    You should also assess the completeness of your answer and suggest ways to improve the knowledge base.
    
    Context: ${context.join('\n\n')}
    
    Please provide:
    1. A comprehensive answer to the query
    2. A confidence score (0-100) based on how well the context supports your answer
    3. A completeness score (0-100) based on how complete the information is
    4. Specific suggestions for additional documents or information that would improve the answer
    
    Format your response as JSON with the following structure:
    {
      "answer": "Your detailed answer here",
      "confidence": 85,
      "completeness": 70,
      "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content || '{}');
    } catch {
      // Fallback if JSON parsing fails
      return {
        answer: content || 'Unable to generate answer',
        confidence: 50,
        completeness: 50,
        suggestions: ['Please provide more context about this topic'],
      };
    }
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
};

export const chunkText = (text: string, maxTokens: number = 8000): string[] => {
  // More accurate token estimation: roughly 4 chars per token
  const estimatedTokens = text.length / 4;

  // If text is smaller than max tokens, return as single chunk
  if (estimatedTokens <= maxTokens) {
    return [text];
  }

  // Split on multiple sentence endings
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentTokenCount = 0;

  for (const sentence of sentences) {
    const sentenceTokenCount = sentence.length / 4;

    if (currentTokenCount + sentenceTokenCount > maxTokens) {
      // If adding this sentence would exceed max tokens, save current chunk
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(" "));
        currentChunk = [];
        currentTokenCount = 0;
      }

      // If single sentence is too large, split it further
      if (sentenceTokenCount > maxTokens) {
        const words = sentence.split(/\s+/);
        let currentWords: string[] = [];

        for (const word of words) {
          const wordTokenCount = word.length / 4;
          if (wordTokenCount + currentTokenCount > maxTokens) {
            chunks.push(currentWords.join(" "));
            currentWords = [];
            currentTokenCount = 0;
          }
          currentWords.push(word);
          currentTokenCount += wordTokenCount;
        }

        if (currentWords.length > 0) {
          chunks.push(currentWords.join(" "));
        }
      } else {
        currentChunk.push(sentence);
        currentTokenCount = sentenceTokenCount;
      }
    } else {
      currentChunk.push(sentence);
      currentTokenCount += sentenceTokenCount;
    }
  }

  // Add any remaining content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
};

export default openai;
