export type News = {
  id: number
  title: string
  content: string
  excerpt: string | null
  imageUrl: string | null
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
  authorId: number | null
  slug: string
  isPublished: boolean
}
