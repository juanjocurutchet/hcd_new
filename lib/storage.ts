import { v2 as cloudinary } from "cloudinary"

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
})

// Función para subir un archivo a Cloudinary
export async function uploadFile(file: File, folder = ""): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Crear un stream a partir del buffer
    const stream = require("stream")
    const bufferStream = new stream.PassThrough()
    bufferStream.end(buffer)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || "hcd-lasflores",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }
          resolve(result?.secure_url || "")
        },
      )

      bufferStream.pipe(uploadStream)
    })
  } catch (error) {
    console.error("Error al subir archivo a Cloudinary:", error)
    throw error
  }
}

export async function deleteFile(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
    console.log(`Archivo eliminado: ${publicId}`)
  } catch (error) {
    console.error("Error al eliminar archivo de Cloudinary:", error)
    throw error
  }
}
