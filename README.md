# AI Knowledge Search

An AI-powered knowledge base search application that allows users to upload documents, search them using natural language, and get AI-generated answers with confidence scoring and enrichment suggestions.

## Features

- **Document Upload**: Support for PDF, DOCX, DOC, and TXT files
- **AI-Powered Search**: Natural language search using OpenAI embeddings
- **Confidence Scoring**: Visual indicators for answer confidence and completeness
- **Enrichment Suggestions**: AI suggests ways to improve the knowledge base
- **User Authentication**: Secure login/signup with MongoDB
- **Document Management**: Upload, view, and delete documents
- **Source Citations**: See which documents contributed to each answer

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Storage**: AWS S3
- **Vector Database**: Pinecone
- **AI**: OpenAI (GPT-4, text-embedding-3-small)
- **Authentication**: JWT with HTTP-only cookies

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- AWS S3 bucket
- Pinecone account
- OpenAI API key

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-knowledge-search

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name

# Pinecone
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set up Pinecone

1. Create a Pinecone account at [pinecone.io](https://pinecone.io)
2. Create a new index named `ai-knowledge-search`
3. Set the dimensions to `1536` (for text-embedding-3-small)
4. Use the `cosine` metric

### 5. Set up AWS S3

1. Create an S3 bucket
2. Configure CORS policy for your domain
3. Create IAM user with S3 permissions
4. Add the credentials to your `.env.local`

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up**: Create a new account or sign in
2. **Upload Documents**: Go to the Knowledge page and upload PDF, DOCX, DOC, or TXT files
3. **Search**: Use the main search interface to ask questions about your documents
4. **View Results**: Get AI-generated answers with confidence scores and source citations
5. **Improve Knowledge**: Follow the enrichment suggestions to improve your knowledge base

## Architecture

### Document Processing Flow

1. User uploads a document
2. Document is parsed (PDF via pdf-parse, Word via mammoth)
3. Text is chunked into smaller pieces
4. Each chunk is converted to embeddings using OpenAI
5. Embeddings are stored in Pinecone with metadata
6. Document metadata is stored in MongoDB

### Search Flow

1. User enters a search query
2. Query is converted to embeddings
3. Similar embeddings are retrieved from Pinecone
4. Context is sent to OpenAI GPT-4 for answer generation
5. AI assesses confidence and completeness
6. Results are returned with sources and suggestions

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user's documents
- `DELETE /api/documents/[id]` - Delete document
- `POST /api/search` - Search knowledge base

## Customization

### UI Theme

The application uses a purple color scheme. You can customize the colors in `src/app/globals.css`:

- Primary purple: `#8b5cf6`
- Light purple: `#a78bfa`
- Dark purple: `#7c3aed`

### AI Model

To use a different OpenAI model, update the model name in `src/lib/openai.ts`:

```typescript
// For embeddings
model: 'text-embedding-3-small'

// For chat completion
model: 'gpt-4'
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running and the connection string is correct
2. **S3 Upload**: Check AWS credentials and bucket permissions
3. **Pinecone**: Verify API key and index configuration
4. **OpenAI**: Ensure API key is valid and has sufficient credits

### Debug Mode

Set `NODE_ENV=development` to enable detailed error logging.

## License

MIT License - see LICENSE file for details.