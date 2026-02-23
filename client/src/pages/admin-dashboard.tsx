import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Plus,
  Eye,
  Edit,
  Download
} from "lucide-react";
import { Link } from "wouter";
import AdminLayout from "@/components/layout/admin-layout";
import { getQueryFn } from "@/lib/queryClient";

interface SystemStats {
  totalUsers: number;
  totalCourses: number;
  totalVideos: number;
  totalResources: number;
  totalEnrollments: number;
  totalForumThreads: number;
  totalForumReplies: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: number;
  isPublished: boolean;
  downloadCount: number;
  createdAt: string;
}

interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<SystemStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: recentVideos, isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ['/api/admin/videos'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: recentResources, isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ['/api/admin/resources'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<AuditLog[]>({
    queryKey: ['/api/admin/activity'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome back, Admin</p>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.totalCourses || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.totalVideos || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.totalResources || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage videos, resources, and courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/courses">
                <Button className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Courses
                </Button>
              </Link>
              <Link href="/admin/videos">
                <Button className="w-full justify-start" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Videos & Resources
                </Button>
              </Link>
              <Link href="/admin/downloads">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Manage Downloads
                </Button>
              </Link>
              <Link href="/admin/content">
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Page Content
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/users">
                <Button className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/contacts">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Messages
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System</CardTitle>
              <CardDescription>Monitor and analyze system activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/trust-downloads">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Trust Downloads
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Videos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Videos</CardTitle>
                <CardDescription>Latest video uploads and updates</CardDescription>
              </div>
              <Link href="/admin/videos">
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Video
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {videosLoading ? (
                <div className="text-center py-4">Loading videos...</div>
              ) : recentVideos && recentVideos.length > 0 ? (
                <div className="space-y-3">
                  {recentVideos.slice(0, 5).map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{video.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{video.viewCount} views</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={video.isPublished ? "default" : "secondary"}>
                          {video.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Link href="/admin/videos">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No videos yet</div>
              )}
            </CardContent>
          </Card>

          {/* Recent Resources */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Resources</CardTitle>
                <CardDescription>Latest resource uploads and updates</CardDescription>
              </div>
              <Link href="/admin/videos">
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {resourcesLoading ? (
                <div className="text-center py-4">Loading resources...</div>
              ) : recentResources && recentResources.length > 0 ? (
                <div className="space-y-3">
                  {recentResources.slice(0, 5).map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{resource.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {((resource.fileSize ?? 0) / 1000000).toFixed(1)} MB • {resource.downloadCount} downloads
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={resource.isPublished ? "default" : "secondary"}>
                          {resource.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Link href="/admin/videos">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No resources yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Activity</CardTitle>
            <CardDescription>Latest administrative actions and system changes</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="text-center py-4">Loading activity...</div>
            ) : recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{log.action}</span> on {log.entityType.replace(/_/g, ' ').toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline">{log.action}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No recent activity</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}