import { useEffect } from "react";

export function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 2400);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="fixed inset-x-0 bottom-6 z-20 flex justify-center px-4">
      <p className="max-w-md rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
        {message}
      </p>
    </div>
  );
}
