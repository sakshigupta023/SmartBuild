export default function LoadingSpinner({ text }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4">
      <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
      {text && <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{text}</span>}
    </div>
  );
}
