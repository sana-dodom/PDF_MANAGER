// app/actions/upload.ts
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function uploadPDF(formData: FormData) {
    try {
        const supabase = await createSupabaseServerClient()

        // Get the file from formData
        const file = formData.get('file') as File

        if (!file) {
            return { error: 'No file provided' }
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            return { error: 'File must be a PDF' }
        }

        // Validate file size (e.g., max 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            return { error: 'File size must be less than 10MB' }
        }

        // Generate unique filename
        const timestamp = Date.now()
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const uniqueFilename = `${timestamp}-${sanitizedFilename}`

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('documents')
            .upload(`uploads/${uniqueFilename}`, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Supabase storage error:', error)
            return { error: 'Failed to upload file: ' + error.message }
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(data.path)

        // Get current user (if authenticated)
        const { data: { user } } = await supabase.auth.getUser()

        // Save file metadata to database with Prisma
        try {
            const pdfRecord = await prisma.pdfUpload.create({
                data: {
                    filename: file.name,
                    filePath: data.path,
                    publicUrl: publicUrl,
                    fileSize: file.size,
                    userId: user?.id || null,
                    metadata: {
                        originalName: file.name,
                        mimeType: file.type,
                        uploadedAt: new Date().toISOString()
                    }
                }
            })

            console.log('PDF record created:', pdfRecord.id)

        } catch (dbError) {
            console.error('Prisma database error:', dbError)
            // Optionally, you might want to delete the uploaded file if metadata save fails
            // await supabase.storage.from('pdfs').remove([data.path])
            return { error: 'Failed to save file metadata' }
        }

        revalidatePath('/') // Revalidate the page where uploads are shown
        revalidatePath('/documents') // If you have a dedicated PDF list page

        return {
            success: true,
            message: 'File uploaded successfully',
            data: {
                path: data.path,
                url: publicUrl,
                filename: file.name,
                size: file.size
            }
        }

    } catch (error) {
        console.error('Upload error:', error)
        return { error: 'An unexpected error occurred' }
    }
}