import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import { useApi } from '../hooks/useApi';
import type { Repository } from '../types';

interface FileUploadProps {
  onUploadSuccess: (repo: Repository) => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { loading, error, executeRequest, clearError } = useApi();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      clearError();
    }
  }, [clearError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      let decimals = 2;
      if (kb >= 100) {
        decimals = 0;
      } else if (kb >= 10) {
        decimals = 1;
      }
      return `${kb.toFixed(decimals)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    const result = await executeRequest(() => ApiService.uploadRepository(uploadedFile));
    
    if (result) {
      onUploadSuccess(result);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    clearError();
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Upload Failed</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-purple-400 bg-purple-50/50 scale-105'
                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Upload your Python repository
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              {isDragActive
                ? 'Drop your ZIP file here...'
                : 'Drag and drop a ZIP file here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                File Ready to Upload
              </h3>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <File className="w-5 h-5" />
                <span className="font-medium">{uploadedFile.name}</span>
                <span className="text-sm">({formatFileSize(uploadedFile.size)})</span>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRemoveFile}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Remove
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>Upload Repository</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Upload Requirements
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            ZIP file containing a Python repository
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Maximum file size: 10MB
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Should contain .py files for analysis
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            The AI will analyze your code and generate documentation
          </li>
        </ul>
      </div>
    </div>
  );
}