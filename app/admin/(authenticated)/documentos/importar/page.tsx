"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, AlertCircle, CheckCircle } from "lucide-react"

export default function ImportarDocumentosPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("csv")
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null)
  const [importResults, setImportResults] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0])
    }
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFiles(e.target.files)
    }
  }

  const handleDownloadTemplate = () => {
    // Crear un CSV de ejemplo
    const csvContent = `title,number,type,content,publishedAt,pdfPath
Ordenanza de Tránsito Municipal,1234/2023,ordenanza,Regula el tránsito en el municipio,2023-01-15,ordenanzas/1234-2023.pdf
Decreto de Emergencia Sanitaria,42/2023,decreto,Declara la emergencia sanitaria,2023-02-20,decretos/42-2023.pdf
Resolución de Presupuesto,89/2023,resolucion,Aprueba modificaciones presupuestarias,2023-03-10,resoluciones/89-2023.pdf`

    // Crear un blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "plantilla-documentos.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setImportResults(null)

    if (!csvFile) {
      setError("Debes seleccionar un archivo CSV")
      return
    }

    setIsUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("csv", csvFile)

      // Añadir PDFs si están disponibles
      if (pdfFiles) {
        for (let i = 0; i < pdfFiles.length; i++) {
          formData.append("pdfs", pdfFiles[i])
        }
      }

      // Añadir el ID del autor (usuario actual)
      formData.append("authorId", (session?.user as any)?.id.toString())

      const response = await fetch("/api/documents/import", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.jwt}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al importar documentos")
      }

      const result = await response.json()
      setImportResults(result)
      setSuccess(`Importación completada: ${result.successful} documentos importados correctamente`)
    } catch (error: any) {
      setError(error.message || "Ocurrió un error durante la importación")
    } finally {
      setIsUploading(false)
      setProgress(100)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Importación Masiva de Documentos</h1>

      <Tabs defaultValue="csv" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="csv">Importar desde CSV</TabsTrigger>
          <TabsTrigger value="folder">Importar desde carpeta</TabsTrigger>
          <TabsTrigger value="help">Ayuda</TabsTrigger>
        </TabsList>

        <TabsContent value="csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar documentos desde CSV</CardTitle>
              <CardDescription>
                Sube un archivo CSV con los datos de los documentos y opcionalmente los archivos PDF asociados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="csvFile">Archivo CSV</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleCsvChange}
                      ref={fileInputRef}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleDownloadTemplate}
                      title="Descargar plantilla CSV"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Sube un archivo CSV con las columnas: title, number, type, content, publishedAt, pdfPath
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdfFiles">Archivos PDF (opcional)</Label>
                  <Input
                    id="pdfFiles"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handlePdfChange}
                    ref={pdfInputRef}
                    disabled={isUploading}
                  />
                  <p className="text-sm text-gray-500">
                    Puedes subir múltiples archivos PDF. Los nombres deben coincidir con los indicados en la columna
                    pdfPath del CSV.
                  </p>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <Label>Progreso</Label>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center">{progress}% completado</p>
                  </div>
                )}

                {importResults && (
                  <div className="space-y-2 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium">Resultados de la importación:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Documentos procesados: {importResults.total}</li>
                      <li className="text-green-600">Importados correctamente: {importResults.successful}</li>
                      <li className="text-red-600">Fallidos: {importResults.failed}</li>
                    </ul>
                    {importResults.failed > 0 && importResults.errors && (
                      <div>
                        <h4 className="font-medium mt-2">Errores:</h4>
                        <div className="max-h-40 overflow-y-auto text-sm">
                          <ul className="list-disc pl-5">
                            {importResults.errors.map((err: any, idx: number) => (
                              <li key={idx} className="text-red-600">
                                {err.document}: {err.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/documentos")}
                    disabled={isUploading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isUploading || !csvFile}>
                    {isUploading ? "Importando..." : "Iniciar Importación"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar desde carpeta del servidor</CardTitle>
              <CardDescription>
                Esta opción permite importar documentos desde una carpeta en el servidor. Requiere acceso al servidor y
                ejecutar un script.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Esta opción es para administradores con acceso al servidor. Deberás ejecutar un script desde la
                    línea de comandos.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h3 className="font-medium">Instrucciones:</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Prepara un archivo CSV con los datos de los documentos y colócalo en el servidor.</li>
                    <li>
                      Organiza los archivos PDF en una carpeta del servidor, siguiendo la estructura indicada en el CSV.
                    </li>
                    <li>
                      Ejecuta el siguiente comando en la terminal del servidor:
                      <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        npm run import-documents -- /ruta/al/archivo.csv /ruta/base/pdfs ID_AUTOR
                      </pre>
                    </li>
                    <li>El script procesará los documentos en lotes para evitar sobrecargar el servidor.</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Ventajas de este método:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Permite importar grandes volúmenes de documentos (miles)</li>
                    <li>No está limitado por el tiempo de ejecución de las solicitudes HTTP</li>
                    <li>Más eficiente para archivos PDF grandes</li>
                    <li>Proporciona logs detallados durante el proceso</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ayuda para la importación masiva</CardTitle>
              <CardDescription>
                Guía detallada para preparar tus datos y realizar una importación exitosa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Formato del archivo CSV</h3>
                  <p>El archivo CSV debe contener las siguientes columnas:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>title</strong>: Título del documento (obligatorio)
                    </li>
                    <li>
                      <strong>number</strong>: Número del documento (ej: 1234/2023)
                    </li>
                    <li>
                      <strong>type</strong>: Tipo de documento (ordenanza, decreto, resolucion, comunicacion)
                    </li>
                    <li>
                      <strong>content</strong>: Contenido o descripción del documento (opcional)
                    </li>
                    <li>
                      <strong>publishedAt</strong>: Fecha de publicación (formato YYYY-MM-DD)
                    </li>
                    <li>
                      <strong>pdfPath</strong>: Ruta relativa al archivo PDF (opcional)
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Preparación de archivos PDF</h3>
                  <p>Para la importación desde CSV con archivos:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Los nombres de los archivos PDF deben coincidir exactamente con los indicados en la columna
                      pdfPath del CSV.
                    </li>
                    <li>Se recomienda organizar los PDFs en carpetas por tipo (ordenanzas, decretos, etc.)</li>
                    <li>
                      Ejemplo de estructura: <code>ordenanzas/1234-2023.pdf</code>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Recomendaciones para grandes volúmenes</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Para más de 500 documentos, utiliza el método de importación desde carpeta del servidor.</li>
                    <li>Divide los archivos CSV en lotes más pequeños (500-1000 documentos por archivo).</li>
                    <li>Optimiza los PDFs para reducir su tamaño antes de la importación.</li>
                    <li>Realiza la importación en horarios de baja carga del servidor.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Solución de problemas comunes</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Error de formato CSV</strong>: Asegúrate de que el CSV esté correctamente formateado y
                      utilice comas como separadores.
                    </li>
                    <li>
                      <strong>PDFs no encontrados</strong>: Verifica que los nombres y rutas de los archivos coincidan
                      exactamente con los indicados en el CSV.
                    </li>
                    <li>
                      <strong>Tiempo de espera agotado</strong>: Para importaciones muy grandes, utiliza el método de
                      importación desde carpeta del servidor.
                    </li>
                    <li>
                      <strong>Errores de Cloudinary</strong>: Verifica que los archivos PDF no excedan el límite de
                      tamaño (10MB) y que sean archivos válidos.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
