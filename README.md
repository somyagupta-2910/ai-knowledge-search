# AI Knowledge Search & Enrichment Platform

An AI-powered knowledge base search application that allows users to upload documents, search them using natural language, and get AI-generated answers with confidence scoring and enrichment suggestions.

## Deployment Link and Video Demo

- [Live App](https://ai-knowledge-search-gules.vercel.app/)
- [Video Demo Link](https://www.loom.com/share/89f879d537ce450a8575dfe9a36678b9?sid=457cbf63-a13e-4341-ac02-40a3d877d350)

## 🎯 Project Overview

This application implements a complete RAG (Retrieval-Augmented Generation) system that enables users to:
- Upload and manage documents (PDF, DOCX, DOC, TXT)
- Search documents using natural language queries
- Receive AI-generated answers with confidence and completeness scoring
- Get suggestions for enriching their knowledge base
- Visualize answer quality through intuitive UI indicators

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │
├─ React Components    ├─ Authentication      ├─ OpenAI API
├─ Tailwind CSS       ├─ Document Processing ├─ Pinecone Vector DB
├─ Context API        ├─ File Storage        ├─ AWS S3
└─ TypeScript         └─ Database Layer      └─ MongoDB
```

### Data Flow Architecture

```
1. Document Upload Flow:
   User → Frontend → API Route → S3 Storage
                              → Document Parser → Text Extraction
                              → OpenAI Embeddings → Pinecone Vector DB
                              → MongoDB Metadata Storage

2. Search Flow:
   User Query → Frontend → API Route → OpenAI Embeddings
                              → Pinecone Similarity Search
                              → Context Retrieval → OpenAI GPT-4o
                              → Answer Generation → Frontend Display
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library with modern hooks
- **TypeScript 5** - Type safety and development experience
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Heroicons** - Icon library for UI components
- **Framer Motion** - Animation library
- **React Dropzone** - File upload handling

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Document metadata storage
- **Mongoose 8.18** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### AI & ML Services
- **OpenAI GPT-4o** - Answer generation and reasoning
- **OpenAI text-embedding-3-small** - Text vectorization (512 dimensions)
- **Pinecone** - Vector similarity search and storage

### File Processing
- **pdf2json** - PDF text extraction (Next.js compatible)
- **mammoth** - Microsoft Word document parsing
- **AWS S3** - File storage and retrieval

### Infrastructure
- **AWS S3** - Scalable file storage
- **Pinecone** - Managed vector database
- **MongoDB** - Document database

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── documents/            # Document management
│   │   │   ├── route.ts          # GET documents
│   │   │   ├── upload/route.ts   # POST upload
│   │   │   └── [id]/route.ts     # DELETE document
│   │   └── search/route.ts       # Search endpoint
│   ├── knowledge/                # Knowledge management page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ConfidenceIndicator.tsx  # Confidence scoring UI
│   ├── DocumentList.tsx         # Document management UI
│   ├── DocumentUpload.tsx       # File upload component
│   ├── LoginForm.tsx            # Authentication form
│   ├── Navbar.tsx               # Navigation component
│   ├── RegisterForm.tsx         # Registration form
│   └── SearchInterface.tsx      # Main search UI
├── contexts/                     # React contexts
│   └── AuthContext.tsx          # Authentication state
├── lib/                         # Utility libraries
│   ├── auth.ts                  # Authentication utilities
│   ├── documentParser.ts        # Document processing
│   ├── mongodb.ts               # Database connection
│   ├── openai.ts                # AI service integration
│   ├── pinecone.ts              # Vector database operations
│   └── s3.ts                    # File storage operations
├── models/                      # Database models
│   ├── Document.ts              # Document schema
│   └── User.ts                  # User schema
└── types/                       # TypeScript definitions
    └── global.d.ts              # Global type declarations
```

## 🔧 Core Features Implementation

### 1. Document Processing Pipeline

**Multi-format Support:**
- **PDF**: Uses `pdf2json` for reliable text extraction
- **Word Documents**: Uses `mammoth` for DOCX/DOC parsing
- **Text Files**: Direct UTF-8 parsing

**Text Chunking Strategy:**
```typescript
// Intelligent chunking based on token estimation
export const chunkText = (text: string, maxTokens: number = 8000): string[] => {
  // 1. Estimate tokens (4 chars per token)
  // 2. Split on sentence boundaries
  // 3. Handle oversized sentences by word splitting
  // 4. Preserve semantic coherence
}
```

### 2. Vector Embeddings & Storage

**Embedding Generation:**
- Model: `text-embedding-3-small`
- Dimensions: 512 (configurable)
- Chunking: Intelligent text segmentation
- Storage: Pinecone vector database

**Vector Search:**
- Similarity search with user filtering
- Configurable top-K results
- Metadata preservation for source tracking

### 3. AI-Powered Answer Generation

**Sophisticated Prompting:**
```typescript
const systemPrompt = `You are an AI assistant that provides accurate answers based on the provided context. 
You should also assess the completeness of your answer and suggest ways to improve the knowledge base.

Please provide:
1. A comprehensive answer to the query
2. A confidence score (0-100) based on how well the context supports your answer
3. A completeness score (0-100) based on how complete the information is
4. Specific suggestions for additional documents or information that would improve the answer`;
```

**Response Structure:**
- Answer generation with GPT-4
- Confidence scoring (0-100)
- Completeness assessment (0-100)
- Enrichment suggestions
- Source citations with relevance scores

### 4. User Interface Design

**Minimalistic Purple Aesthetic:**
- Primary color: Purple (#8b5cf6)
- Clean, modern design
- Responsive layout
- Intuitive user experience

**Key UI Components:**
- **SearchInterface**: Perplexity-like search experience
- **ConfidenceIndicator**: Visual confidence/completeness scoring
- **DocumentUpload**: Drag-and-drop file upload
- **DocumentList**: Document management with delete functionality

### 5. Authentication & Security

**JWT-based Authentication:**
- HTTP-only cookies for security
- Password hashing with bcryptjs
- User session management
- Protected API routes

**User Isolation:**
- Each user has separate document collections
- Vector search filtered by user ID
- Secure file storage with user-specific paths

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- AWS S3 bucket
- Pinecone account
- OpenAI API key

### Environment Setup

Create `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-knowledge-search

# JWT
JWT_SECRET=your-super-secret-jwt-key

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
```

### Installation

```bash
# Install dependencies
npm install

# Set up Pinecone index
# Create index named 'knowledge-search' with 512 dimensions

# Run development server
npm run dev
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Document Management
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user's documents
- `DELETE /api/documents/[id]` - Delete document

### Search
- `POST /api/search` - Search knowledge base

## 🔍 Key Technical Decisions

### 1. PDF Parsing Solution
**Problem**: `pdf-parse` library had compatibility issues with Next.js
**Solution**: Switched to `pdf2json` for reliable server-side PDF processing

### 2. Vector Dimension Management
**Problem**: Mismatch between embedding dimensions and Pinecone index
**Solution**: Configured OpenAI embeddings to generate 512-dimensional vectors

### 3. Text Chunking Strategy
**Approach**: Token-based chunking with sentence boundary preservation
**Benefits**: Maintains semantic coherence while respecting token limits

### 4. Confidence Scoring System
**Implementation**: AI-generated confidence and completeness scores
**Visualization**: Color-coded indicators (green/yellow/red)

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Visual feedback during processing
- **Error Handling**: User-friendly error messages
- **Progress Indicators**: Upload progress visualization
- **Source Citations**: Transparent answer attribution
- **Confidence Visualization**: Clear quality indicators

## 🔒 Security Features

- **JWT Authentication**: Secure session management
- **Password Hashing**: bcryptjs with salt rounds
- **User Isolation**: Separate data per user
- **Input Validation**: Server-side validation
- **File Type Restrictions**: Only allowed document types