import { useEffect } from 'react';

export default function Toast({ message, visible, onHide }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2500);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      bg-[#0d1b2e] text-white text-sm px-5 py-2.5 rounded-lg shadow-xl
      border border-[#5A8DE3]/30 animate-[fadeInUp_0.3s_ease]">
      {message}
    </div>
  );
}
