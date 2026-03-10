// components/PDFUploader.tsx
'use client'

import { useState } from 'react'
import { uploadPDF } from '@/app/actions/upLoad'

export function PDFUploader() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ url: string, filename: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setUploading(true)
    setMessage(null)
    setUploadedFile(null)

    try {
      const result = await uploadPDF(formData)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: result.message || 'Upload réussi'})
        if (result.data) {
          setUploadedFile({
            url: result.data.url,
            filename: result.data.filename
          })
        }
        // Reset the form
        const form = document.getElementById('upload-form') as HTMLFormElement
        form?.reset()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload file' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload PDF</h2>
      
      <form id="upload-form" action={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="file" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select PDF File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf,application/pdf"
            required
            disabled={uploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Maximum file size: 10MB
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : 'Upload PDF'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {uploadedFile && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700">Uploaded File:</p>
          <a 
            href={uploadedFile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
          >
            {uploadedFile.filename}
          </a>
        </div>
      )}
    </div>
  )
}