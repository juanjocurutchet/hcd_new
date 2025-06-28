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
    console.log(`Iniciando subida de archivo: ${file.name}, tamaño: ${file.size} bytes`)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || "hcd-lasflores",
          resource_type: "auto",
          // transformation: [
          //   { width: 400, height: 400, crop: "fill", gravity: "face" },
          //   { quality: "auto", fetch_format: "auto" },
          // ],
        },
        (error, result) => {
          if (error) {
            console.error("Error en Cloudinary:", error)
            reject(error)
            return
          }
          if (result) {
            console.log("Archivo subido exitosamente:", result.secure_url)
            resolve(result.secure_url)
          } else {
            reject(new Error("No se recibió resultado de Cloudinary"))
          }
        },
      )

      uploadStream.end(buffer)
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
