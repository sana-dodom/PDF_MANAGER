import { PDFUploader } from '@/components/PDFUploader'
import { PDFList } from '@/components/PDFList' // Optional: Component to list uploaded PDFs

export default function HomePage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        PDF Upload with Supabase
      </h1>
      
      <PDFUploader />
      
      {/* Optional: Display list of uploaded PDFs */}
      <div className="mt-10">
        <PDFList />
      </div>
    </main>
  )
}