import { useState, useEffect, useMemo } from "react"
import { Input } from "./components/input"
import { Button } from "./components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/table"
import { Card, CardContent, CardHeader, CardTitle } from "./components/card"
import { Badge } from "./components/badge"
import { Search, ChevronLeft, ChevronRight, Edit2, Check, X, Loader2 } from "lucide-react"
import { Textarea } from "./components/textarea"

interface Comment {
  id: number
  name: string
  email: string
  body: string
  postId: number
}

interface Post {
  id: number
  title: string
}

interface EditableComment extends Comment {}

const ITEMS_PER_PAGE = 10

export default function CommentsApp() {
  const [comments, setComments] = useState<EditableComment[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingCell, setEditingCell] = useState<{ id: number; field: "name" | "body" } | null>(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [commentsResponse, postsResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/comments"),
          fetch("https://jsonplaceholder.typicode.com/posts"),
        ])

        if (!commentsResponse.ok || !postsResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const commentsData = await commentsResponse.json()
        const postsData = await postsResponse.json()

        const savedEdits = localStorage.getItem("commentEdits")
        const edits = savedEdits ? JSON.parse(savedEdits) : {}

        const commentsWithEdits = commentsData.map((comment: Comment) => {
          const savedEdit = edits[comment.id]
          if (savedEdit) {
            return {
              ...comment,
              name: savedEdit.name || comment.name,
              body: savedEdit.body || comment.body,
            }
          }
          return comment
        })

        setComments(commentsWithEdits)
        setPosts(postsData)
      } catch (err) {
        setError("Failed to load data. Please try again.")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredComments = useMemo(() => {
    if (!searchTerm.trim()) return comments

    const searchLower = searchTerm.toLowerCase()
    return comments.filter(
      (comment) =>
        comment.email.toLowerCase().includes(searchLower) ||
        comment.name.toLowerCase().includes(searchLower) ||
        comment.body.toLowerCase().includes(searchLower),
    )
  }, [comments, searchTerm])

  const paginatedComments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredComments.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredComments, currentPage])

  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const getPostTitle = (postId: number) => {
    const post = posts.find((p) => p.id === postId)
    return post?.title || "Loading..."
  }

  const startEdit = (id: number, field: "name" | "body", currentValue: string) => {
    setEditingCell({ id, field })
    setEditValue(currentValue)
  }

  const saveEdit = (id: number, field: "name" | "body") => {
    if (editValue.trim() === "") return

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === id) {
          const updated = { ...comment, [field]: editValue.trim() }

          const savedEdits = JSON.parse(localStorage.getItem("commentEdits") || "{}")
          savedEdits[id] = {
            ...savedEdits[id],
            [field]: editValue.trim(),
          }
          localStorage.setItem("commentEdits", JSON.stringify(savedEdits))

          return updated
        }
        return comment
      }),
    )

    setEditingCell(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue("")
  }
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading comments...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Comments Table</CardTitle>
              <Badge variant="secondary">
                {filteredComments.length} comment{filteredComments.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredComments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No comments found matching your search.</p>
              </div>
            ) : (
              <>
                <div className="block sm:hidden space-y-4">
                  {paginatedComments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{comment.email}</p>
                          <p className="text-xs text-gray-500 mt-1">Post: {getPostTitle(comment.postId)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Name:</p>
                        {editingCell?.id === comment.id && editingCell?.field === "name" ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 flex-1"
                              autoFocus
                            />
                            <Button size="sm" variant="ghost" onClick={() => saveEdit(comment.id, "name")}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="flex-1 text-sm">{comment.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(comment.id, "name", comment.name)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Body:</p>
                        {editingCell?.id === comment.id && editingCell?.field === "body" ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="min-h-[80px]"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => saveEdit(comment.id, "body")}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <span className="flex-1 text-sm leading-relaxed">{comment.body}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(comment.id, "body", comment.body)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Email</TableHead>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead className="w-[300px]">Body</TableHead>
                        <TableHead className="w-[250px]">Post</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedComments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium">{comment.email}</TableCell>
                          <TableCell>
                            {editingCell?.id === comment.id && editingCell?.field === "name" ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="h-8"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={() => saveEdit(comment.id, "name")}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 group">
                                <span className="flex-1">{comment.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => startEdit(comment.id, "name", comment.name)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingCell?.id === comment.id && editingCell?.field === "body" ? (
                              <div className="flex items-start gap-2">
                                <Textarea
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="min-h-[60px]"
                                  autoFocus
                                />
                                <div className="flex flex-col gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => saveEdit(comment.id, "body")}>
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2 group">
                                <span className="flex-1 text-sm leading-relaxed">{comment.body}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                                  onClick={() => startEdit(comment.id, "body", comment.body)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">{getPostTitle(comment.postId)}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                    <div className="text-sm text-gray-700 text-center sm:text-left">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredComments.length)} of {filteredComments.length}{" "}
                      results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </Button>
                      <div className="flex items-center gap-1">
                        {(() => {
                          const maxVisiblePages = 5
                          let startPage = 1
                          let endPage = Math.min(maxVisiblePages, totalPages)
                          
                          if (totalPages > maxVisiblePages) {
                            if (currentPage <= 3) {
                              startPage = 1
                              endPage = maxVisiblePages
                            } else if (currentPage >= totalPages - 2) {
                              startPage = totalPages - maxVisiblePages + 1
                              endPage = totalPages
                            } else {
                              startPage = currentPage - 2
                              endPage = currentPage + 2
                            }
                          }
                          
                          return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                            const pageNum = startPage + i
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => goToPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            )
                          })
                        })()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
