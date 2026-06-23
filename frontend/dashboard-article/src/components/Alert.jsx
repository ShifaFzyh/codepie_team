// src/components/Alert.jsx
// Komponen pesan notifikasi (success / error / info)

export default function Alert({ message, type = "info", onClose }) {
  const styles = {
    success: "bg-green-100 border-green-300 text-green-800",
    error:   "bg-red-100 border-red-300 text-red-800",
    info:    "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className={`${styles[type]} px-4 py-3 rounded border mb-4 flex items-center justify-between`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-lg leading-none">
        ×
      </button>
    </div>
  );
}
