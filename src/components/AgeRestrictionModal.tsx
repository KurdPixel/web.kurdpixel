"use client";

import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
};

export default function AgeRestrictionModal({ isOpen, onConfirm }: Props) {
  const [blurred, setBlurred] = useState(true);
  const [confirmCount, setConfirmCount] = useState(0);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmCount < 2) {
      setConfirmCount(confirmCount + 1);
    } else {
      setBlurred(false);
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/40"
        aria-hidden="true"
      ></div>

      {/* Modal content */}
      <div className="relative z-10 bg-gradient-to-br from-red-900 to-red-700 p-8 rounded-lg shadow-2xl max-w-md mx-4 text-center border-2 border-red-500">
        <div className="mb-4">
          <span className="kurdish-text text-6xl font-bold text-white">١٨+</span>
        </div>
        
        <h2 className="kurdish-text text-2xl font-bold text-white mb-4">تەمەن سنووردارە</h2>
        
        <p className="kurdish-text text-red-100 text-lg mb-6">
          تکایە ئەم فلیمە بۆ کەسانی تەمەن سەروو ١٨ ساڵە
ئەگەر خوار ئەم تەمەنی تکایە سەیری مەکە، چونکە ئەم فیلمە دیمەنی نەشیاوی تێدایە
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleConfirm}
            className="kurdish-text bg-white text-red-600 font-semibold py-3 cursor-pointer px-8 rounded-lg hover:bg-red-100 transition-colors"
          >
         {confirmCount === 0 ? "سەروو ١٨ ساڵم" : confirmCount === 1 ? "بەجدی؟" : "گولی وەڵا"}
          </button>
          <a href="/" className="kurdish-text bg-white text-red-600 font-bold py-3 cursor-pointer px-8 rounded-lg hover:bg-red-100 transition-colors">
            گەڕانەوە
          </a>
        </div>
      </div>
    </div>
  );
}
