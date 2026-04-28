import { useState } from "react"
import client from "../api/client"

export default function Upload() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await client.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setMessage(` Uploaded ${response.data.uploaded} transactions`)
    } catch (error) {
      setMessage(" Upload failed. Check your CSV format.")
    }
  }

  return (
  <div>
    <h1>Upload your bank CSV</h1>

    <input
      type="file"
      accept=".csv"
      onChange={(e) => setFile(e.target.files[0])}
    />

    <button onClick={handleUpload}>
      Upload
    </button>

    <p>{message}</p>
  </div>
)
}
