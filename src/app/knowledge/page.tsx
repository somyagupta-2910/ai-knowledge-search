'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import DocumentUpload from '@/components/DocumentUpload';
import DocumentList from '@/components/DocumentList';

interface Document {
  _id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export default function KnowledgePage() {
  const { user, loading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      } else {
        setError('Failed to fetch documents');
      }
    } catch {
      setError('Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUploaded = (newDocument: Document) => {
    setDocuments(prev => [newDocument, ...prev]);
  };

  const handleDocumentDeleted = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc._id !== documentId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center purple-gradient">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center purple-gradient">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to access your knowledge base</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
            <p className="text-gray-600">Upload and manage your documents</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
            </div>

            {/* Documents List */}
            <div className="lg:col-span-2">
              <DocumentList
                documents={documents}
                isLoading={isLoading}
                error={error}
                onDocumentDeleted={handleDocumentDeleted}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
