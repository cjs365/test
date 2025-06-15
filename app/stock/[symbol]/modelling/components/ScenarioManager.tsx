import { useState } from 'react';
import { Scenario } from '../types';

interface SaveScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

export const SaveScenarioModal = ({ isOpen, onClose, onSave }: SaveScenarioModalProps) => {
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!scenarioName.trim()) return;
    onSave(scenarioName, scenarioDescription);
    setScenarioName('');
    setScenarioDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Save Scenario</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="scenarioName" className="block text-sm font-medium text-gray-700 mb-1">
              Scenario Name *
            </label>
            <input
              type="text"
              id="scenarioName"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter scenario name"
            />
          </div>
          <div>
            <label htmlFor="scenarioDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="scenarioDescription"
              value={scenarioDescription}
              onChange={(e) => setScenarioDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter scenario description"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!scenarioName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LoadScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: Scenario[];
  onLoad: (scenario: Scenario) => void;
  onDelete: (index: number) => void;
  onShare: (scenario: Scenario) => void;
}

export const LoadScenarioModal = ({ isOpen, onClose, scenarios, onLoad, onDelete, onShare }: LoadScenarioModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Load Scenario</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {scenarios.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No saved scenarios found.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scenarios.map((scenario, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{scenario.name}</div>
                        {scenario.description && (
                          <div className="text-xs text-gray-500">{scenario.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(scenario.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => onLoad(scenario)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => onShare(scenario)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => onDelete(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

interface ShareScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
  shareMessage: string;
  onShareMessageChange: (message: string) => void;
}

export const ShareScenarioModal = ({ 
  isOpen, 
  onClose, 
  shareLink, 
  shareMessage, 
  onShareMessageChange 
}: ShareScenarioModalProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    const textToCopy = `${shareMessage}\n\n${shareLink}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Share Scenario</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Custom Message Input */}
          <div>
            <label htmlFor="shareMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Message
            </label>
            <textarea
              id="shareMessage"
              value={shareMessage}
              onChange={(e) => onShareMessageChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a custom message about your scenario"
              rows={2}
            />
          </div>
          
          <p className="text-sm text-gray-600">
            Share this link with others to let them view your scenario:
          </p>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="w-full px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              {copySuccess ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          {copySuccess && (
            <p className="text-sm text-green-600">Link copied to clipboard!</p>
          )}
          
          {/* Social Media Sharing Options */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Share directly to:</p>
            <div className="flex space-x-3">
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareMessage)}`, '_blank')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`, '_blank')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A66C2] text-white hover:bg-opacity-90"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(shareMessage)}`, '_blank')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:bg-opacity-90"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`Stock Valuation Scenario`)}&body=${encodeURIComponent(`${shareMessage}\n\n${shareLink}`)}`, '_blank')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 text-white hover:bg-opacity-90"
                aria-label="Share via Email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* QR Code Option */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => {
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}`;
                window.open(qrCodeUrl, '_blank');
              }}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-5 2h2v2h-2v-2zm2 4h2v2h-2v-2zm2-4h2v4h-2v-4z" />
              </svg>
              Generate QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 