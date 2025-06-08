import React from 'react';

export default function ResultsPanel() {
  return (
    <div className="w-96 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <div className="space-y-4">
        {/* Results content will be added here based on evaluation data */}
        <p className="text-gray-600">Select items to view comparison results</p>
      </div>
    </div>
  );
}