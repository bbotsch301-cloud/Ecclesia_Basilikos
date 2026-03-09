import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  BookOpen,
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Video,
  FileText,
  Pencil,
  X,
  Check,
  Upload,
  ExternalLink,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Loader2,
  LayoutDashboard,
  PlayCircle,
  Copy,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/admin-layout";
import { usePageTitle } from "@/hooks/usePageTitle";

interface CourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string | null;
  price: number | null;
  imageUrl: string | null;
  isPublished: boolean | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface LessonData {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  order: number;
  duration: string | null;
  createdAt: string;
}

function getYouTubeEmbedId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

// ===== COURSE LIST VIEW =====
function CourseListView() {
  usePageTitle("Admin - Course Content Editor");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    duration: "",
    price: 0,
    imageUrl: "",
  });

  const { data: courses, isLoading } = useQuery<CourseData[]>({
    queryKey: ["/api/courses"],
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: typeof courseForm) => {
      return apiRequest("POST", "/api/admin/courses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Course Created", description: "Course has been created successfully." });
      setCourseDialogOpen(false);
      setCourseForm({ title: "", description: "", category: "", level: "beginner", duration: "", price: 0, imageUrl: "" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const togglePublishedMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("PATCH", `/api/admin/courses/${id}/toggle-published`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Deleted", description: "Course has been deleted." });
    },
  });

  const categories = courses ? Array.from(new Set(courses.map(c => c.category))).sort() : [];

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = courses ? {
    total: courses.length,
    published: courses.filter(c => c.isPublished).length,
    draft: courses.filter(c => !c.isPublished).length,
  } : { total: 0, published: 0, draft: 0 };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-royal-navy to-royal-burgundy bg-clip-text text-transparent dark:from-royal-gold dark:to-amber-300">
              Course Content Editor
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage courses, edit lesson content, and attach videos
            </p>
          </div>
          <Button
            onClick={() => setCourseDialogOpen(true)}
            className="bg-royal-navy hover:bg-royal-navy/90 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-blue-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Total Courses</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-900 border-green-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.published}</p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900 border-amber-200/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.draft}</p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Drafts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-royal-gold" />
          </div>
        ) : filteredCourses && filteredCourses.length > 0 ? (
          <div className="grid gap-4">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-royal-gold/30"
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Color indicator */}
                    <div className={`w-1.5 rounded-l-lg shrink-0 ${course.isPublished ? 'bg-green-500' : 'bg-amber-400'}`} />

                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                              {course.title}
                            </h3>
                            <Badge
                              variant={course.isPublished ? "default" : "secondary"}
                              className={`shrink-0 text-[10px] ${course.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : ''}`}
                            >
                              {course.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            {course.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">{course.category}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{course.level}</Badge>
                            {course.duration && <Badge variant="outline" className="text-xs">{course.duration}</Badge>}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                            className="bg-royal-navy hover:bg-royal-navy/90 text-white shadow-sm"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Content
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePublishedMutation.mutate(course.id)}
                              title={course.isPublished ? "Unpublish" : "Publish"}
                              className="flex-1"
                            >
                              {course.isPublished ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure? This deletes "{course.title}" and all its lessons permanently.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteCourseMutation.mutate(course.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No courses found</p>
              <p className="text-gray-400 text-sm mt-1">Create your first course to get started</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Course Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Course</DialogTitle>
            <DialogDescription>Fill in the course details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
              <Input
                placeholder="Course title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
              <Textarea
                placeholder="Course description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                <Input
                  placeholder="e.g., Trust Law"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Level *</label>
                <Select
                  value={courseForm.level}
                  onValueChange={(value) => setCourseForm({ ...courseForm, level: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                <Input
                  placeholder="e.g., 4 weeks"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price (cents)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
              <Input
                placeholder="https://..."
                value={courseForm.imageUrl}
                onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => createCourseMutation.mutate(courseForm)}
                disabled={createCourseMutation.isPending || !courseForm.title || !courseForm.description || !courseForm.category}
                className="bg-royal-navy hover:bg-royal-navy/90"
              >
                {createCourseMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Create Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

// ===== COURSE DETAIL EDITOR =====
function CourseDetailEditor() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId!;
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [contentTab, setContentTab] = useState("edit");

  // Course edit form
  const [courseEditForm, setCourseEditForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    duration: "",
    price: 0,
    imageUrl: "",
  });

  // Lesson form
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    order: 0,
    duration: "",
  });

  const { data: courseData, isLoading } = useQuery<CourseData & { lessons: LessonData[] }>({
    queryKey: ["/api/courses", courseId],
  });

  usePageTitle(courseData?.title ? `Edit: ${courseData.title}` : "Edit Course");

  const lessons = courseData?.lessons ? [...courseData.lessons].sort((a, b) => a.order - b.order) : [];
  const selectedLesson = selectedLessonId
    ? lessons.find(l => l.id === selectedLessonId)
    : lessons[0] || null;

  // Select first lesson by default
  useEffect(() => {
    if (!selectedLessonId && lessons.length > 0) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons.length, selectedLessonId]);

  // Initialize course edit form
  useEffect(() => {
    if (courseData) {
      setCourseEditForm({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        duration: courseData.duration || "",
        price: courseData.price || 0,
        imageUrl: courseData.imageUrl || "",
      });
    }
  }, [courseData]);

  // Initialize lesson form when selecting a lesson for editing
  useEffect(() => {
    if (editingLessonId && selectedLesson && editingLessonId === selectedLesson.id) {
      setLessonForm({
        title: selectedLesson.title,
        description: selectedLesson.description || "",
        content: selectedLesson.content || "",
        videoUrl: selectedLesson.videoUrl || "",
        order: selectedLesson.order,
        duration: selectedLesson.duration || "",
      });
    }
  }, [editingLessonId, selectedLesson]);

  // Mutations
  const updateCourseMutation = useMutation({
    mutationFn: async (data: typeof courseEditForm) => {
      return apiRequest("PATCH", `/api/admin/courses/${courseId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Course Updated" });
      setIsEditingCourse(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const togglePublishedMutation = useMutation({
    mutationFn: async () => apiRequest("PATCH", `/api/admin/courses/${courseId}/toggle-published`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: async (data: typeof lessonForm) => {
      return apiRequest("POST", `/api/admin/courses/${courseId}/lessons`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId] });
      toast({ title: "Lesson Created" });
      setLessonDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof lessonForm }) => {
      return apiRequest("PATCH", `/api/admin/lessons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId] });
      toast({ title: "Lesson Updated" });
      setEditingLessonId(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/lessons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId] });
      toast({ title: "Lesson Deleted" });
      setSelectedLessonId(null);
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-royal-gold" />
        </div>
      </AdminLayout>
    );
  }

  if (!courseData) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <p className="text-gray-500">Course not found</p>
          <Button variant="outline" onClick={() => navigate("/admin/courses")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Courses
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const youtubeId = getYouTubeEmbedId(selectedLesson?.videoUrl ?? null);
  const isEditing = editingLessonId === selectedLesson?.id;

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/courses")}
              className="shrink-0"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="min-w-0">
              {isEditingCourse ? (
                <Input
                  value={courseEditForm.title}
                  onChange={(e) => setCourseEditForm({ ...courseEditForm, title: e.target.value })}
                  className="text-lg font-bold h-8"
                />
              ) : (
                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {courseData.title}
                </h1>
              )}
            </div>
            <Badge
              variant={courseData.isPublished ? "default" : "secondary"}
              className={`shrink-0 cursor-pointer ${courseData.isPublished ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'hover:bg-gray-200'}`}
              onClick={() => togglePublishedMutation.mutate()}
            >
              {courseData.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isEditingCourse ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingCourse(false)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => updateCourseMutation.mutate(courseEditForm)}
                  disabled={updateCourseMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {updateCourseMutation.isPending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                  Save Course
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingCourse(true)}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit Details
              </Button>
            )}
            <Link href={`/course/${courseId}`} target="_blank">
              <Button size="sm" variant="outline">
                <ExternalLink className="h-3 w-3 mr-1" />
                Preview
              </Button>
            </Link>
          </div>
        </div>

        {/* Course Details (collapsible) */}
        {isEditingCourse && (
          <div className="bg-gray-50 dark:bg-gray-900 border-b px-6 py-4 shrink-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
              <div>
                <label className="text-xs font-medium text-gray-500">Description</label>
                <Textarea
                  value={courseEditForm.description}
                  onChange={(e) => setCourseEditForm({ ...courseEditForm, description: e.target.value })}
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Category</label>
                <Input
                  value={courseEditForm.category}
                  onChange={(e) => setCourseEditForm({ ...courseEditForm, category: e.target.value })}
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Level</label>
                <Select
                  value={courseEditForm.level}
                  onValueChange={(v) => setCourseEditForm({ ...courseEditForm, level: v })}
                >
                  <SelectTrigger className="mt-1 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Image URL</label>
                <Input
                  value={courseEditForm.imageUrl}
                  onChange={(e) => setCourseEditForm({ ...courseEditForm, imageUrl: e.target.value })}
                  className="mt-1 text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Lesson Sidebar */}
          <div className="w-72 bg-white dark:bg-gray-800 border-r flex flex-col shrink-0">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-royal-gold" />
                Lessons ({lessons.length})
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setLessonForm({
                    title: "",
                    description: "",
                    content: "",
                    videoUrl: "",
                    order: lessons.length + 1,
                    duration: "",
                  });
                  setLessonDialogOpen(true);
                }}
                className="h-7 w-7 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {lessons.map((lesson, i) => {
                  const isActive = selectedLesson?.id === lesson.id;
                  const hasVideo = !!lesson.videoUrl;
                  const hasContent = !!lesson.content;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        if (editingLessonId && editingLessonId !== lesson.id) {
                          setEditingLessonId(null);
                        }
                        setSelectedLessonId(lesson.id);
                        setContentTab("edit");
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all text-sm group ${
                        isActive
                          ? "bg-royal-navy text-white shadow-md"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`text-xs font-mono mt-0.5 font-bold ${isActive ? "text-royal-gold" : "text-gray-400"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs leading-snug truncate">{lesson.title}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {hasVideo && (
                              <PlayCircle className={`h-3 w-3 ${isActive ? 'text-royal-gold' : 'text-blue-500'}`} />
                            )}
                            {hasContent && (
                              <FileText className={`h-3 w-3 ${isActive ? 'text-gray-300' : 'text-gray-400'}`} />
                            )}
                            {!hasVideo && !hasContent && (
                              <span className={`text-[10px] ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>Empty</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {lessons.length === 0 && (
                  <div className="text-center py-8 px-4">
                    <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No lessons yet</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => {
                        setLessonForm({
                          title: "",
                          description: "",
                          content: "",
                          videoUrl: "",
                          order: 1,
                          duration: "",
                        });
                        setLessonDialogOpen(true);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add First Lesson
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Content Editor */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
            {selectedLesson ? (
              <>
                {/* Lesson Header */}
                <div className="bg-white dark:bg-gray-800 border-b px-6 py-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {isEditing ? (
                      <Input
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                        className="text-base font-bold h-8 max-w-md"
                      />
                    ) : (
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-royal-gold uppercase tracking-wider">
                          Lesson {lessons.findIndex(l => l.id === selectedLesson.id) + 1}
                        </p>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">
                          {selectedLesson.title}
                        </h2>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingLessonId(null)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateLessonMutation.mutate({ id: selectedLesson.id, data: lessonForm })}
                          disabled={updateLessonMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {updateLessonMutation.isPending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingLessonId(selectedLesson.id);
                            setLessonForm({
                              title: selectedLesson.title,
                              description: selectedLesson.description || "",
                              content: selectedLesson.content || "",
                              videoUrl: selectedLesson.videoUrl || "",
                              order: selectedLesson.order,
                              duration: selectedLesson.duration || "",
                            });
                          }}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                              <AlertDialogDescription>
                                Delete "{selectedLesson.title}"? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteLessonMutation.mutate(selectedLesson.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                  <div className="max-w-5xl mx-auto p-6 space-y-6">
                    {/* Video Section */}
                    <Card className="overflow-hidden shadow-sm">
                      <CardHeader className="py-3 px-4 bg-gray-50 dark:bg-gray-800/50 border-b">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Video className="h-4 w-4 text-blue-500" />
                          Video
                          {selectedLesson.videoUrl && !isEditing && (
                            <Badge variant="outline" className="text-[10px] ml-auto">
                              {getYouTubeEmbedId(selectedLesson.videoUrl) ? "YouTube" : "External"}
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Video URL (YouTube, Vimeo, or direct link)</label>
                              <Input
                                placeholder="https://youtube.com/watch?v=... or paste embed URL"
                                value={lessonForm.videoUrl}
                                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                            {lessonForm.videoUrl && getYouTubeEmbedId(lessonForm.videoUrl) && (
                              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                <iframe
                                  className="w-full h-full"
                                  src={`https://www.youtube.com/embed/${getYouTubeEmbedId(lessonForm.videoUrl)}`}
                                  title="Video Preview"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            )}
                            {lessonForm.videoUrl && !getYouTubeEmbedId(lessonForm.videoUrl) && (
                              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                <video
                                  src={lessonForm.videoUrl}
                                  controls
                                  className="w-full h-full"
                                />
                              </div>
                            )}
                          </div>
                        ) : youtubeId ? (
                          <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${youtubeId}`}
                              title={selectedLesson.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : selectedLesson.videoUrl ? (
                          <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <video
                              src={selectedLesson.videoUrl}
                              controls
                              className="w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                            <div className="text-center">
                              <Video className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                              <p className="text-sm text-gray-400 dark:text-gray-500">No video attached</p>
                              <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                                Click Edit to add a video URL
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Lesson Metadata (when editing) */}
                    {isEditing && (
                      <Card className="shadow-sm">
                        <CardHeader className="py-3 px-4 bg-gray-50 dark:bg-gray-800/50 border-b">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4 text-purple-500" />
                            Lesson Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Description</label>
                              <Textarea
                                value={lessonForm.description}
                                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                                className="mt-1 text-sm"
                                rows={2}
                                placeholder="Brief lesson description..."
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Order</label>
                              <Input
                                type="number"
                                value={lessonForm.order}
                                onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 0 })}
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Duration</label>
                              <Input
                                placeholder="e.g., 30 minutes"
                                value={lessonForm.duration}
                                onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Content Section */}
                    <Card className="shadow-sm">
                      <CardHeader className="py-3 px-4 bg-gray-50 dark:bg-gray-800/50 border-b">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-500" />
                            Lesson Content
                            {selectedLesson.content && (
                              <span className="text-[10px] text-gray-400 font-normal">
                                ({selectedLesson.content.length.toLocaleString()} chars)
                              </span>
                            )}
                          </CardTitle>
                          {isEditing && (
                            <Tabs value={contentTab} onValueChange={setContentTab}>
                              <TabsList className="h-7">
                                <TabsTrigger value="edit" className="text-xs px-3 h-5">Edit</TabsTrigger>
                                <TabsTrigger value="preview" className="text-xs px-3 h-5">Preview</TabsTrigger>
                                <TabsTrigger value="split" className="text-xs px-3 h-5">Split</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {isEditing ? (
                          <div className={contentTab === "split" ? "grid grid-cols-2 divide-x" : ""}>
                            {(contentTab === "edit" || contentTab === "split") && (
                              <div className="relative">
                                <Textarea
                                  value={lessonForm.content}
                                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                  className="min-h-[500px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm p-4"
                                  placeholder="Write lesson content in Markdown..."
                                />
                              </div>
                            )}
                            {(contentTab === "preview" || contentTab === "split") && (
                              <div className="p-6 min-h-[500px] overflow-auto">
                                <MarkdownPreview content={lessonForm.content} />
                              </div>
                            )}
                          </div>
                        ) : selectedLesson.content ? (
                          <div className="p-6">
                            <MarkdownPreview content={selectedLesson.content} />
                          </div>
                        ) : (
                          <div className="p-12 text-center">
                            <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 dark:text-gray-500">No content yet</p>
                            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                              Click Edit to add lesson content (Markdown supported)
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Select a lesson to view its content</p>
                  <p className="text-gray-400 text-sm mt-1">Or add a new lesson to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
            <DialogDescription>Create a new lesson for this course</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Lesson title"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Brief lesson description"
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Order</label>
                <Input
                  type="number"
                  value={lessonForm.order}
                  onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Video URL</label>
                <Input
                  placeholder="YouTube or video URL"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => createLessonMutation.mutate(lessonForm)}
                disabled={createLessonMutation.isPending || !lessonForm.title}
                className="bg-royal-navy hover:bg-royal-navy/90"
              >
                {createLessonMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Lesson
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

// ===== MARKDOWN PREVIEW COMPONENT =====
function MarkdownPreview({ content }: { content: string }) {
  if (!content) return <p className="text-gray-400 text-sm">No content</p>;

  return (
    <article className="prose prose-sm max-w-none
      prose-headings:font-bold
      prose-h1:text-xl prose-h1:text-royal-navy prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2 prose-h1:mb-4
      prose-h2:text-lg prose-h2:text-royal-navy prose-h2:mt-6 prose-h2:mb-3
      prose-h3:text-base prose-h3:text-royal-navy prose-h3:mt-5 prose-h3:mb-2
      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3
      prose-strong:text-gray-900
      prose-a:text-royal-gold prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-4 prose-blockquote:border-royal-gold prose-blockquote:bg-amber-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
      prose-code:bg-gray-100 prose-code:text-red-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
      prose-ul:my-3 prose-ol:my-3
      prose-li:text-gray-700
      prose-table:text-xs
      prose-thead:bg-royal-navy prose-thead:text-white
      prose-th:px-3 prose-th:py-2 prose-th:text-left
      prose-td:px-3 prose-td:py-2 prose-td:border-b
      dark:prose-headings:text-royal-gold
      dark:prose-p:text-gray-300
      dark:prose-strong:text-gray-100
      dark:prose-blockquote:bg-royal-navy/30 dark:prose-blockquote:text-gray-300
      dark:prose-code:bg-gray-800 dark:prose-code:text-amber-400
      dark:prose-li:text-gray-300
      dark:prose-td:text-gray-300
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}

// ===== MAIN EXPORT =====
export default function AdminCourseEditor() {
  const params = useParams<{ courseId: string }>();
  if (params.courseId) {
    return <CourseDetailEditor />;
  }
  return <CourseListView />;
}
