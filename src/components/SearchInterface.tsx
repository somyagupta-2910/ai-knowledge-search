'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ConfidenceIndicator from './ConfidenceIndicator';

interface SearchResult {
  answer: string;
  confidence: number;
  completeness: number;
  suggestions: string[];
  sources: Array<{
    filename: string;
    content: string;
    score: number;
  }>;
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Search Your Knowledge Base
        </h1>
        <p className="text-lg text-gray-600">
          Ask questions in natural language and get AI-powered answers
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="input-primary pl-10 pr-4 py-4 text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <SparklesIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {result && (
        <div className="space-y-6">
          {/* Answer */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Answer</h2>
              <div className="flex space-x-4">
                <ConfidenceIndicator 
                  type="confidence" 
                  value={result.confidence} 
                  label="Confidence" 
                />
                <ConfidenceIndicator 
                  type="completeness" 
                  value={result.completeness} 
                  label="Completeness" 
                />
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{result.answer}</p>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Suggestions to Improve Knowledge Base
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Sources ({result.sources.length})
              </h3>
              <div className="space-y-3">
                {result.sources.map((source, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{source.filename}</span>
                      <span className="text-sm text-gray-500">
                        {(source.score * 100).toFixed(1)}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {source.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 purple-gradient rounded-full flex items-center justify-center">
            <MagnifyingGlassIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start searching your knowledge base
          </h3>
          <p className="text-gray-500">
            Upload documents and ask questions to get AI-powered answers
          </p>
        </div>
      )}
    </div>
  );
}
