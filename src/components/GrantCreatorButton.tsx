"use client";
import React, { useState } from "react";

export default function GrantCreatorButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/grant-creator', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setMsg('Role granted — refreshing...');
        setTimeout(() => location.reload(), 800);
      } else {
        setMsg('Error: ' + (data.error || 'unknown'));
      }
    } catch (e) {
      setMsg('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? 'Granting...' : 'Grant creator role (debug)'}
      </button>
      {msg && <p className="mt-2 text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
