import API from "../api/axiosInstance";

function PDFUploader({ onUploaded }) {
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await API.post("/docs/upload", formData);
    onUploaded(res.data);
  };

  return (
    <div className="p-6 bg-white border rounded text-center shadow">
      <p className="text-gray-600 mb-4">Upload a PDF file</p>
      <input type="file" id="pdf" className="hidden" onChange={handleChange} />
      <label htmlFor="pdf" className="bg-primary text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">Choose File</label>
    </div>
  );
}

export default PDFUploader;
