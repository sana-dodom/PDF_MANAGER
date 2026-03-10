-- CreateTable
CREATE TABLE "pdf_uploads" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "metadata" JSONB,

    CONSTRAINT "pdf_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pdf_uploads_user_id_idx" ON "pdf_uploads"("user_id");

-- CreateIndex
CREATE INDEX "pdf_uploads_uploaded_at_idx" ON "pdf_uploads"("uploaded_at");
