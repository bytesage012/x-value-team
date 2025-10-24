import React, { useState } from 'react';
import { uploadImages } from '../services/api';

const UploadTest = () => {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFiles(Array.from(e.target.files || []));
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await uploadImages(files);
      setResult(res);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Upload test</h3>
      <input type="file" accept="image/*" multiple onChange={handleChange} />
      <div className="mt-4 flex gap-2">
        <button onClick={handleUpload} disabled={loading || files.length===0} className="bg-primary text-white px-4 py-2 rounded">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        <button onClick={() => { setFiles([]); setResult(null); setError(null); }} className="border px-4 py-2 rounded">
          Clear
        </button>
      </div>

      {error && <div className="text-red-500 mt-3">Error: {String(error)}</div>}

      {result && (
        <div className="mt-3">
          <div>Returned URLs:</div>
          <ul className="list-disc pl-5">
            {result.map((u, i) => (
              <li key={i}><a href={u} target="_blank" rel="noreferrer" className="text-primary">{u}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadTest;
