import type { Metadata } from "next"
import Link from "next/link"
import { getLatestDocuments } from "@/actions/document-actions"
import { formatDate } from "@/lib/utils/format"

export const metadata: Metadata = {
  title: "Legislación | Concejo Deliberante de Las Flores",
  description: "Consulta ordenanzas, decretos, resoluciones y comunicaciones del Concejo Deliberante de Las Flores",
}

export default async function LegislacionPage() {
  // Obtener los últimos documentos de cada tipo
  const ordenanzas = await getLatestDocuments(5, "ordenanza")
  const decretos = await getLatestDocuments(5, "decreto")
  const resoluciones = await getLatestDocuments(5, "resolucion")
  const comunicaciones = await getLatestDocuments(5, "comunicacion")

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#0e4c7d]">Legislación</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#0e4c7d]">Ordenanzas</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul className="divide-y divide-gray-200">
              {ordenanzas.length > 0 ? (
                ordenanzas.map((doc) => (
                  <li key={doc.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-500">
                          {doc.number && <span className="mr-2">N° {doc.number}</span>}
                          <span>{doc.published_at ? formatDate(doc.published_at) : "-"}</span>
                        </p>
                      </div>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#29ABE2] hover:underline flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          PDF
                        </a>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">No hay ordenanzas disponibles</li>
              )}
            </ul>
            <div className="mt-4 text-center">
              <Link href="/legislacion/ordenanzas" className="text-[#29ABE2] hover:underline inline-flex items-center">
                Ver todas las ordenanzas
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#0e4c7d]">Decretos</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul className="divide-y divide-gray-200">
              {decretos.length > 0 ? (
                decretos.map((doc) => (
                  <li key={doc.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-500">
                          {doc.number && <span className="mr-2">N° {doc.number}</span>}
                          <span>{doc.published_at ? formatDate(doc.published_at) : "-"}</span>
                        </p>
                      </div>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#29ABE2] hover:underline flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          PDF
                        </a>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">No hay decretos disponibles</li>
              )}
            </ul>
            <div className="mt-4 text-center">
              <Link href="/legislacion/decretos" className="text-[#29ABE2] hover:underline inline-flex items-center">
                Ver todos los decretos
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#0e4c7d]">Resoluciones</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul className="divide-y divide-gray-200">
              {resoluciones.length > 0 ? (
                resoluciones.map((doc) => (
                  <li key={doc.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-500">
                          {doc.number && <span className="mr-2">N° {doc.number}</span>}
                          <span>{doc.published_at ? formatDate(doc.published_at) : "-"}</span>
                        </p>
                      </div>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#29ABE2] hover:underline flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          PDF
                        </a>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">No hay resoluciones disponibles</li>
              )}
            </ul>
            <div className="mt-4 text-center">
              <Link
                href="/legislacion/resoluciones"
                className="text-[#29ABE2] hover:underline inline-flex items-center"
              >
                Ver todas las resoluciones
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#0e4c7d]">Comunicaciones</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul className="divide-y divide-gray-200">
              {comunicaciones.length > 0 ? (
                comunicaciones.map((doc) => (
                  <li key={doc.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-500">
                          {doc.number && <span className="mr-2">N° {doc.number}</span>}
                          <span>{doc.published_at ? formatDate(doc.published_at) : "-"}</span>
                        </p>
                      </div>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#29ABE2] hover:underline flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          PDF
                        </a>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">No hay comunicaciones disponibles</li>
              )}
            </ul>
            <div className="mt-4 text-center">
              <Link
                href="/legislacion/comunicaciones"
                className="text-[#29ABE2] hover:underline inline-flex items-center"
              >
                Ver todas las comunicaciones
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-[#0e4c7d]">Buscar en la legislación</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Palabra clave o número
              </label>
              <input
                type="text"
                id="search"
                name="search"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#29ABE2]"
                placeholder="Ej: transporte, medio ambiente, 1234/2023..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de documento
                </label>
                <select
                  id="type"
                  name="type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#29ABE2]"
                >
                  <option value="">Todos</option>
                  <option value="ordenanza">Ordenanzas</option>
                  <option value="decreto">Decretos</option>
                  <option value="resolucion">Resoluciones</option>
                  <option value="comunicacion">Comunicaciones</option>
                </select>
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Año
                </label>
                <select
                  id="year"
                  name="year"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#29ABE2]"
                >
                  <option value="">Todos</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-[#0e4c7d] text-white rounded-md hover:bg-[#0a3d68] transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
