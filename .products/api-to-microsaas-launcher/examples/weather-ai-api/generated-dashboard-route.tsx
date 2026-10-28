'use client';

import React, { useState } from 'react';

export default function ApiKeysDashboard() {
  const [keys, setKeys] = useState([
    { id: 'key_1', name: 'Production Micro-Service', prefix: 'sk_live_9a7f...', created: '2026-10-15' }
  ]);
  const [usageCount, setUsageCount] = useState(14250);

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-2">WeatherAI Developer Portal</h1>
      <p className="text-gray-600 mb-6">Manage API keys and monitor metered usage.</p>

      {/* Usage Overview Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
        <h2 className="text-sm font-semibold uppercase text-gray-500 mb-1">Billing Cycle Usage</h2>
        <div className="text-3xl font-bold">{usageCount.toLocaleString()} requests</div>
        <div className="text-sm text-green-600 mt-1">Est. Monthly Cost: ${(usageCount * 0.005).toFixed(2)}</div>
      </div>

      {/* API Key List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Active API Keys</h3>
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
            Create New Key
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Key Token</th>
              <th className="p-4">Created</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {keys.map(k => (
              <tr key={k.id} className="border-b border-gray-100">
                <td className="p-4 font-medium">{k.name}</td>
                <td className="p-4 font-mono text-gray-600">{k.prefix}</td>
                <td className="p-4 text-gray-500">{k.created}</td>
                <td className="p-4">
                  <button className="text-red-600 hover:underline">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
