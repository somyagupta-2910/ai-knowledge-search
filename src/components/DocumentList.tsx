'use client';

import { useState } from 'react';
import { 
  DocumentIcon, 
  TrashIcon, 
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Document {
  _id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  error: string;
  onDocumentDeleted: (documentId: string) => void;
}

export default function DocumentList({ documents, isLoading, error, onDocumentDeleted }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    setDeletingId(documentId);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDocumentDeleted(documentId);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete document');
      }
    } catch {
      alert('Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'docx':
      case 'doc':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📄';
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Documents</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Documents</h2>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Documents</h2>
        <span className="text-sm text-gray-500">{documents.length} documents</span>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500">Upload your first document to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document, index) => (
            <div
              key={document._id || `document-${index}`}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 purple-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">
                    {getFileIcon(document.fileType)}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {document.filename}
                </h3>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{formatDate(document.uploadedAt)}</span>
                  </span>
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span className="uppercase">{document.fileType}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDelete(document._id)}
                  disabled={deletingId === document._id}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Delete document"
                >
                  {deletingId === document._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <TrashIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
