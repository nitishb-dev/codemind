import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export function Alert({ type = 'info', title, children, onClose }: AlertProps) {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const Icon = icons[type];

  return (
    <div className={`rounded-lg border p-4 ${colors[type]}`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}