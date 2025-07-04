import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FileText, Trash2, Pencil, Upload, Inbox } from "lucide-react";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/docs");
      setDocs(res.data);
    } catch {
      toast.error("Failed to fetch documents");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await API.post("/docs/upload", formData);
      toast.success("Uploaded successfully");
      navigate(`/sign/${res.data._id}`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await API.delete(`/docs/${docId}`);
      setDocs((prev) => prev.filter((doc) => doc._id !== docId));
      toast.success("Document deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // Enhanced view handler with more debugging
  const handleView = (doc) => {
    console.log('View button clicked!', doc);
    console.log('Environment variable:', import.meta.env.VITE_API_URL);
    
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/${doc.fileName}`;
    
    console.log('Constructed URL:', fileUrl);
    
    // Show alert to confirm click is working
    alert(`Attempting to open: ${fileUrl}`);
    
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSize = (bytes) => {
    if (!bytes || typeof bytes !== "number") return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + units[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 py-24 px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-400 to-pink-400 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4 shadow">
            <img src="/documents.jpg" alt="Logo" className="h-9 w-9 rounded shadow mr-[10px]" /> Document Manager
          </div>
          <h1 className="text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
            Manage Your PDFs
          </h1>
          <p className="text-gray-500 text-lg">
            Upload, sign, and store documents securely in one place.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => document.getElementById("uploadInput").click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <Upload size={18} />
            {isUploading ? "Uploading..." : "Upload PDF"}
          </button>
          <input
            id="uploadInput"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {/* Document Cards */}
        {docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="bg-white border border-gray-100 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 p-6 relative overflow-hidden group"
              >
                {/* Remove the overlay that might be blocking clicks */}
                {/* <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-tr from-pink-200 via-indigo-200 to-yellow-100 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition" /> */}
                
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <FileText />
                  <p className="font-semibold text-gray-800 truncate">
                    {doc.originalName || doc.fileName}
                  </p>
                </div>

                <div className="text-xs text-gray-500 mb-5">
                  {formatSize(doc.size)} &nbsp;•&nbsp; {formatDate(doc.uploadedAt)}
                </div>

                {/* Enhanced buttons with better styling and z-index */}
                <div className="flex justify-between text-sm font-medium relative z-10">
                  <button
                    onClick={() => handleView(doc)}
                    onMouseDown={(e) => {
                      console.log('Mouse down on view button');
                      e.preventDefault();
                    }}
                    className="text-blue-600 hover:underline hover:text-blue-700 cursor-pointer bg-transparent border-none p-2 -m-2 rounded"
                    style={{ zIndex: 20 }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      console.log('Sign button clicked');
                      navigate(`/sign/${doc._id}`);
                    }}
                    className="text-green-600 hover:text-green-700 flex items-center gap-1 bg-transparent border-none p-2 -m-2 rounded"
                    style={{ zIndex: 20 }}
                  >
                    <Pencil size={16} />
                    Sign
                  </button>
                  <button
                    onClick={() => {
                      console.log('Delete button clicked');
                      handleDelete(doc._id);
                    }}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 bg-transparent border-none p-2 -m-2 rounded"
                    style={{ zIndex: 20 }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-32">
            <Inbox size={48} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-xl font-semibold">No documents yet</h2>
            <p className="text-sm">Click "Upload PDF" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}