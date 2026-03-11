import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  Loader2,
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

export default function AdminCourses() {
  usePageTitle("Admin - Courses");
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonData | null>(null);
  const [managingCourseId, setManagingCourseId] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    duration: "",
    price: 0,
    imageUrl: "",
  });

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    order: 0,
    duration: "",
  });

  const { data: courses, isLoading } = useQuery<CourseData[]>({
    queryKey: ["/api/courses"],
  });

  const { data: courseDetail } = useQuery<CourseData & { lessons: LessonData[] }>({
    queryKey: ["/api/courses", expandedCourse],
    queryFn: async () => {
      if (!expandedCourse) return null;
      const res = await fetch(`/api/courses/${expandedCourse}`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!expandedCourse,
  });

  const lessons = courseDetail?.lessons;

  // Course mutations
  const createCourseMutation = useMutation({
    mutationFn: async (data: typeof courseForm) => {
      return apiRequest("POST", "/api/admin/courses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Course Created", description: "Course has been created successfully." });
      setCourseDialogOpen(false);
      resetCourseForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to create course", variant: "destructive" });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof courseForm }) => {
      return apiRequest("PATCH", `/api/admin/courses/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Course Updated", description: "Course has been updated successfully." });
      setCourseDialogOpen(false);
      resetCourseForm();
      setEditingCourse(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to update course", variant: "destructive" });
    },
  });

  const togglePublishedMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/admin/courses/${id}/toggle-published`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Status Updated", description: "Course publish status updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to update course", variant: "destructive" });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({ title: "Course Deleted", description: "Course has been deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to delete course", variant: "destructive" });
    },
  });

  // Lesson mutations
  const createLessonMutation = useMutation({
    mutationFn: async ({ courseId, data }: { courseId: string; data: typeof lessonForm }) => {
      return apiRequest("POST", `/api/admin/courses/${courseId}/lessons`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", expandedCourse] });
      toast({ title: "Lesson Created", description: "Lesson has been created successfully." });
      setLessonDialogOpen(false);
      resetLessonForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to create lesson", variant: "destructive" });
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof lessonForm }) => {
      return apiRequest("PATCH", `/api/admin/lessons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", expandedCourse] });
      toast({ title: "Lesson Updated", description: "Lesson has been updated successfully." });
      setLessonDialogOpen(false);
      resetLessonForm();
      setEditingLesson(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to update lesson", variant: "destructive" });
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", expandedCourse] });
      toast({ title: "Lesson Deleted", description: "Lesson has been deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Failed to delete lesson", variant: "destructive" });
    },
  });

  const resetCourseForm = () => {
    setCourseForm({ title: "", description: "", category: "", level: "beginner", duration: "", price: 0, imageUrl: "" });
  };

  const resetLessonForm = () => {
    setLessonForm({ title: "", description: "", content: "", videoUrl: "", order: 0, duration: "" });
  };

  const handleEditCourse = (course: CourseData) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration || "",
      price: course.price || 0,
      imageUrl: course.imageUrl || "",
    });
    setCourseDialogOpen(true);
  };

  const handleEditLesson = (lesson: LessonData) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || "",
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      order: lesson.order,
      duration: lesson.duration || "",
    });
    setLessonDialogOpen(true);
  };

  const handleCourseSubmit = () => {
    if (editingCourse) {
      updateCourseMutation.mutate({ id: editingCourse.id, data: courseForm });
    } else {
      createCourseMutation.mutate(courseForm);
    }
  };

  const handleLessonSubmit = () => {
    if (editingLesson) {
      updateLessonMutation.mutate({ id: editingLesson.id, data: lessonForm });
    } else if (managingCourseId) {
      createLessonMutation.mutate({ courseId: managingCourseId, data: lessonForm });
    }
  };

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = !searchTerm ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "published" && course.isPublished) ||
      (statusFilter === "draft" && !course.isPublished);
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "beginner": return "default";
      case "intermediate": return "secondary";
      case "advanced": return "destructive";
      default: return "outline";
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Create and manage courses and lessons</p>
          </div>
          <Button
            onClick={() => {
              setEditingCourse(null);
              resetCourseForm();
              setCourseDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading courses...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {course.imageUrl ? (
                          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg truncate">{course.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant={getLevelBadge(course.level) as any}>{course.level}</Badge>
                          {course.duration && <Badge variant="outline">{course.duration}</Badge>}
                          <Badge variant={course.isPublished ? "default" : "secondary"}>
                            {course.isPublished ? "Published" : "Draft"}
                          </Badge>
                          {course.price != null && course.price > 0 && (
                            <Badge variant="outline">${(course.price / 100).toFixed(2)}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setExpandedCourse(expandedCourse === course.id ? null : course.id);
                          setManagingCourseId(course.id);
                        }}
                        title="Manage Lessons"
                      >
                        <ListOrdered className="h-4 w-4 mr-1" />
                        Lessons
                        {expandedCourse === course.id ? (
                          <ChevronUp className="h-3 w-3 ml-1" />
                        ) : (
                          <ChevronDown className="h-3 w-3 ml-1" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublishedMutation.mutate(course.id)}
                        title={course.isPublished ? "Unpublish" : "Publish"}
                      >
                        {course.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditCourse(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{course.title}"? This will also delete all lessons. This action cannot be undone.
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

                  {/* Lessons section */}
                  {expandedCourse === course.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Lessons
                        </h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingLesson(null);
                            setManagingCourseId(course.id);
                            resetLessonForm();
                            setLessonForm((prev) => ({
                              ...prev,
                              order: (lessons?.length || 0) + 1,
                            }));
                            setLessonDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Lesson
                        </Button>
                      </div>
                      {lessons && lessons.length > 0 ? (
                        <div className="space-y-2">
                          {lessons
                            .sort((a, b) => a.order - b.order)
                            .map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="text-xs font-mono text-gray-400 w-6 text-center">
                                    {lesson.order}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{lesson.title}</p>
                                    {lesson.duration && (
                                      <p className="text-xs text-gray-500">{lesson.duration}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditLesson(lesson)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Delete "{lesson.title}"? This cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteLessonMutation.mutate(lesson.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No lessons yet. Add the first lesson to get started.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No courses found</p>
                <p className="text-gray-500 text-sm">Create your first course to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Course Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Update course details" : "Fill in the course information"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Course title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Course description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category *</label>
                <Input
                  placeholder="e.g., Trust Law"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Level *</label>
                <Select
                  value={courseForm.level}
                  onValueChange={(value) => setCourseForm({ ...courseForm, level: value })}
                >
                  <SelectTrigger>
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
                <label className="text-sm font-medium">Duration</label>
                <Input
                  placeholder="e.g., 4 weeks"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price (cents, 0 for free)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                placeholder="Course image URL"
                value={courseForm.imageUrl}
                onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCourseDialogOpen(false);
                  resetCourseForm();
                  setEditingCourse(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCourseSubmit}
                disabled={
                  createCourseMutation.isPending ||
                  updateCourseMutation.isPending ||
                  !courseForm.title ||
                  !courseForm.description ||
                  !courseForm.category
                }
              >
                {createCourseMutation.isPending || updateCourseMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingCourse
                    ? "Update Course"
                    : "Create Course"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
            <DialogDescription>
              {editingLesson ? "Update lesson details" : "Add a lesson to this course"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Lesson title"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Lesson description"
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Lesson content/notes"
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Video URL</label>
                <Input
                  placeholder="Video URL"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Order</label>
                <Input
                  type="number"
                  value={lessonForm.order}
                  onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Duration</label>
                <Input
                  placeholder="e.g., 30 minutes"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setLessonDialogOpen(false);
                  resetLessonForm();
                  setEditingLesson(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLessonSubmit}
                disabled={
                  createLessonMutation.isPending || updateLessonMutation.isPending || !lessonForm.title
                }
              >
                {createLessonMutation.isPending || updateLessonMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingLesson
                    ? "Update Lesson"
                    : "Add Lesson"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
