import { db } from "@/lib/db"
import { documents } from "@/lib/db/schema"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
})

interface DocumentImport {
  title: string
  number: string
  type: "ordenanza" | "decreto" | "resolucion" | "comunicacion"
  content?: string
  publishedAt: string
  pdfPath?: string
}

async function uploadFileToCloudinary(filePath: string, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
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
  })
}

async function importDocumentsFromCSV(csvFilePath: string, pdfBasePath: string, authorId: number, batchSize = 50) {
  // Leer el archivo CSV
  const csvContent = fs.readFileSync(csvFilePath, "utf-8")

  // Parsear el CSV usando csv-parse/sync
  const docsToImport: DocumentImport[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  console.log(`Leyendo ${docsToImport.length} documentos del CSV...`)

  // Procesar en lotes
  const batches = Math.ceil(docsToImport.length / batchSize)

  for (let i = 0; i < batches; i++) {
    const start = i * batchSize
    const end = Math.min(start + batchSize, docsToImport.length)
    const batch = docsToImport.slice(start, end)

    console.log(`Procesando lote ${i + 1}/${batches} (documentos ${start + 1} a ${end})`)

    // Procesar cada documento en el lote
    const promises = batch.map(async (doc) => {
      try {
        let fileUrl = null

        // Si hay una ruta de PDF, subir el archivo
        if (doc.pdfPath) {
          const pdfFullPath = path.join(pdfBasePath, doc.pdfPath)
          if (fs.existsSync(pdfFullPath)) {
            console.log(`Subiendo archivo: ${pdfFullPath}`)
            fileUrl = await uploadFileToCloudinary(pdfFullPath, `documents/${doc.type}`)
          } else {
            console.warn(`Archivo no encontrado: ${pdfFullPath}`)
          }
        }

        // Insertar en la base de datos
        await db.insert(documents).values({
          title: doc.title,
          number: doc.number,
          type: doc.type,
          content: doc.content || "",
          fileUrl,
          publishedAt: new Date(doc.publishedAt),
          authorId,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        return { success: true, number: doc.number }
      } catch (error) {
        console.error(`Error al procesar documento ${doc.number}:`, error)
        return { success: false, number: doc.number, error }
      }
    })

    const results = await Promise.all(promises)
    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    console.log(`Lote ${i + 1} completado: ${successful} exitosos, ${failed} fallidos`)

    // Pequeña pausa entre lotes para no sobrecargar la API de Cloudinary
    if (i < batches - 1) {
      console.log("Esperando 2 segundos antes del siguiente lote...")
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  console.log("Importación completada")
}

// Función principal
async function main() {
  const csvFilePath = process.argv[2]
  const pdfBasePath = process.argv[3]
  const authorId = Number.parseInt(process.argv[4])
  const batchSize = Number.parseInt(process.argv[5] || "50")

  if (!csvFilePath || !pdfBasePath || isNaN(authorId)) {
    console.error("Uso: ts-node import-documents.ts <ruta-csv> <ruta-base-pdfs> <id-autor> [tamaño-lote]")
    process.exit(1)
  }

  try {
    await importDocumentsFromCSV(csvFilePath, pdfBasePath, authorId, batchSize)
  } catch (error) {
    console.error("Error en la importación:", error)
    process.exit(1)
  }
}

// Ejecutar el script
main()
