// src/composables/useSupabaseStorage.ts
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../config'

export const useSupabaseStorage = () => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref<string | null>(null)

  /**
   * Validates file before upload
   */
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      error.value = `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      return false
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      error.value = 'Only PDF files are allowed'
      return false
    }

    error.value = null
    return true
  }

  /**
   * Generates a unique filename with timestamp and random string
   */
  const generateFileName = (originalName: string): string => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${timestamp}_${randomString}.${extension}`
  }

  /**
   * Uploads file to Supabase Storage
   * @param file - File to upload
   * @param bucket - Storage bucket name (default: 'certificates')
   * @param folder - Folder path within bucket (default: 'certificates')
   * @returns Promise with public URL or null if failed
   */
  const uploadFile = async (
    file: File,
    bucket: string = 'certificates',
    folder: string = 'certificates'
  ): Promise<string | null> => {
    try {
      // Validate file
      if (!validateFile(file)) {
        return null
      }

      isUploading.value = true
      uploadProgress.value = 0
      error.value = null

      // Generate unique filename
      const fileName = generateFileName(file.name)
      const filePath = `${folder}/${fileName}`

      // Simulate progress for better UX (Supabase doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += Math.floor(Math.random() * 10) + 5
        }
      }, 200)

      // Upload file to Supabase Storage
      const { data: _data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        error.value = uploadError.message
        isUploading.value = false
        return null
      }

      // Complete progress
      uploadProgress.value = 100

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setTimeout(() => {
        isUploading.value = false
      }, 500)

      return publicUrlData.publicUrl

    } catch (err) {
      console.error('File upload error:', err)
      error.value = err instanceof Error ? err.message : 'Upload failed'
      isUploading.value = false
      return null
    }
  }

  /**
   * Deletes file from Supabase Storage
   * @param filePath - Full path to the file
   * @param bucket - Storage bucket name
   */
  const deleteFile = async (
    filePath: string,
    bucket: string = 'certificates'
  ): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (deleteError) {
        console.error('Delete error:', deleteError)
        error.value = deleteError.message
        return false
      }

      return true
    } catch (err) {
      console.error('File delete error:', err)
      error.value = err instanceof Error ? err.message : 'Delete failed'
      return false
    }
  }

  /**
   * Gets public URL for a file
   * @param filePath - Full path to the file
   * @param bucket - Storage bucket name
   */
  const getPublicUrl = (
    filePath: string,
    bucket: string = 'certificates'
  ): string => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }

  /**
   * Lists files in a folder
   * @param folder - Folder path
   * @param bucket - Storage bucket name
   */
  const listFiles = async (
    folder: string = 'certificates',
    bucket: string = 'certificates'
  ) => {
    try {
      const { data, error: listError } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (listError) {
        console.error('List error:', listError)
        error.value = listError.message
        return null
      }

      return data
    } catch (err) {
      console.error('List files error:', err)
      error.value = err instanceof Error ? err.message : 'Failed to list files'
      return null
    }
  }

  /**
   * Downloads file from Supabase Storage
   * @param filePath - Full path to the file
   * @param bucket - Storage bucket name
   */
  const downloadFile = async (
    filePath: string,
    bucket: string = 'certificates'
  ): Promise<Blob | null> => {
    try {
      const { data, error: downloadError } = await supabase.storage
        .from(bucket)
        .download(filePath)

      if (downloadError) {
        console.error('Download error:', downloadError)
        error.value = downloadError.message
        return null
      }

      return data
    } catch (err) {
      console.error('File download error:', err)
      error.value = err instanceof Error ? err.message : 'Download failed'
      return null
    }
  }

  /**
   * Resets upload state
   */
  const resetUploadState = () => {
    isUploading.value = false
    uploadProgress.value = 0
    error.value = null
  }

  return {
    // State
    isUploading,
    uploadProgress,
    error,

    // Methods
    uploadFile,
    deleteFile,
    getPublicUrl,
    listFiles,
    downloadFile,
    validateFile,
    resetUploadState
  }
}