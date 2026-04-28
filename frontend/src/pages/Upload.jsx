import { useState } from "react"
import { useNavigate } from "react-router-dom"
import client from "../api/client"

export default function Upload() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await client.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setMessage(`✅ Uploaded ${response.data.uploaded} transactions`)
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch (error) {
      setMessage("❌ Upload failed. Check your CSV format.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">SpendIQ</h1>
          <p className="text-gray-500 mt-1 text-sm">AI-powered spending insights</p>
        </div>

        {/* Upload card */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-6">
          <p className="text-gray-400 text-sm mb-4">Upload your bank CSV to get started</p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-500"
          />
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-4 text-gray-600">{message}</p>
        )}
      </div>
    </div>
  )
}
