'use client';
import { useState, ChangeEvent } from 'react';

interface Match {
  'Job Title': string;
  Match_Score: number;
}

interface MatchResult {
  best_match: Match;
  all_matches: Match[];
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/match', {
        method: 'POST',
        body: formData,
      });

      const data: MatchResult = await res.json();
      console.log('✅ Server response:', data);
      setResult(data);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert("Something went wrong while uploading.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">📄 Job Matcher</h1>

        <div className="flex text-black flex-col items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mb-4 border border-gray-300 p-2 rounded-md w-full"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            Upload Resume
          </button>
        </div>

        {loading && (
          <p className="text-yellow-600 text-center mt-4 animate-pulse">⏳ Matching resume...</p>
        )}

        {result && result.best_match && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-green-600 mb-2">🎯 Best Match</h2>
            <div className="bg-green-50 text-black p-4 rounded-md border border-green-200 mb-6">
              <p><strong>Job Title:</strong> {result.best_match['Job Title']}</p>
              <p><strong>Match Score:</strong> {result.best_match.Match_Score.toFixed(2)}%</p>
            </div>

            <h3 className="text-xl font-medium mb-2 text-blue-700">📋 All Matches</h3>
            <ul className="list-disc pl-6 space-y-1">
              {result.all_matches.map((match, idx) => (
                <li key={idx} className="text-gray-700">
                  {match['Job Title']} - {match.Match_Score.toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
