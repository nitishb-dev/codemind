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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
        clearError();
      }
    },
    [clearError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/zip': ['.zip'] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;
    const result = await executeRequest(() =>
      ApiService.uploadRepository(uploadedFile)
    );
    if (result) onUploadSuccess(result);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-6 sm:p-10 transition-all">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-purple-400 bg-purple-50 scale-[1.02]'
                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
              Upload your Python repository
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Drag & drop a ZIP file here, or click to select
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Max size: 10MB</p>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              File Ready to Upload
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-600">
              <File className="w-5 h-5" />
              <span className="font-medium">{uploadedFile.name}</span>
              <span className="text-sm">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setUploadedFile(null)}
                disabled={loading}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Remove
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
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
        <h4 className="font-semibold text-blue-900 mb-3">📋 Upload Requirements</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>ZIP file containing a Python repository</li>
          <li>Maximum file size: 10MB</li>
          <li>Repository must include `.py` files</li>
          <li>The AI will analyze your code and generate documentation</li>
        </ul>
      </div>
    </div>
  );
}
