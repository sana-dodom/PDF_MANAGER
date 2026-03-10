// components/PDFList.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function PDFList() {
    const supabase = await createSupabaseServerClient()

    const { data: files, error } = await supabase.storage
        .from('documents')
        .list('uploads', {
            limit: 10,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' }
        })

    if (error) {
        return <div className="text-red-500">Error loading files: {error.message}</div>
    }

    if (!files?.length) {
        return <div className="text-gray-500">No PDFs uploaded yet</div>
    }

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Recent Uploads</h2>
            <ul className="space-y-2">
                {files.map((file) => {
                    const { data: { publicUrl } } = supabase.storage
                        .from('documents/uploads')
                        .getPublicUrl(file.name)

                    return (
                        <li key={file.id} className="p-3 bg-white rounded-md shadow">
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                {file.name.replace(/^\d+-/, '')} {/* Remove timestamp prefix */}
                            </a>
                            {
                                file.created_at &&
                                <p className="text-xs text-gray-500 mt-1">
                                    Uploaded: {new Date(file.created_at).toLocaleDateString()}
                                </p>
                            }

                        </li>
                    )
                })}
            </ul>
        </div>
    )
}