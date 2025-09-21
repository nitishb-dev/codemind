import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ApiService } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import type { Repository } from '../../types';

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
    maxSize: 50 * 1024 * 1024, // 50MB limit
  });

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
        <Alert type="error" title="Upload Failed">
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload your Python repository
              </h3>
              <p className="text-gray-600 mb-4">
                {isDragActive
                  ? 'Drop your ZIP file here...'
                  : 'Drag and drop a ZIP file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">
                Maximum file size: 50MB
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  File Ready to Upload
                </h3>
                <div className="flex items-center justify-center space-x-2 mt-2 text-gray-600">
                  <File className="w-4 h-4" />
                  <span>{uploadedFile.name}</span>
                  <span className="text-sm">
                    ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleRemoveFile}
                  disabled={loading}
                >
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  loading={loading}
                >
                  Upload Repository
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent>
          <h4 className="font-medium text-blue-900 mb-2">📋 Upload Requirements</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• ZIP file containing a Python repository</li>
            <li>• Maximum file size: 50MB</li>
            <li>• Should contain .py files for analysis</li>
            <li>• The AI will analyze your code and generate documentation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}