import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  Search, 
  Calendar,
  Mail,
  User,
  Globe,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "@/components/layout/admin-layout";
import { getQueryFn } from "@/lib/queryClient";
import { usePageTitle } from "@/hooks/usePageTitle";

interface TrustDownload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  downloadedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function AdminTrustDownloads() {
  usePageTitle("Admin - Trust Downloads");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: downloads = [], isLoading } = useQuery<TrustDownload[]>({
    queryKey: ['/api/admin/trust-downloads'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const filteredDownloads = downloads.filter(download =>
    download.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    download.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    download.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Email', 'First Name', 'Last Name', 'Downloaded At', 'IP Address'];
    const csvData = [
      headers,
      ...filteredDownloads.map(download => [
        download.email,
        download.firstName,
        download.lastName,
        format(new Date(download.downloadedAt), 'yyyy-MM-dd HH:mm:ss'),
        download.ipAddress || ''
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trust-downloads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Macintosh')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux';
    
    return 'Desktop';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold">Trust Document Downloads</h1>
          <div className="flex items-center justify-center py-20">
            <div className="text-lg">Loading downloads...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trust Document Downloads</h1>
          <p className="text-muted-foreground">
            Manage email signups and track document downloads
          </p>
        </div>
        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloads.length}</div>
            <p className="text-xs text-muted-foreground">
              All time signups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {downloads.filter(d => 
                new Date(d.downloadedAt).getMonth() === new Date().getMonth()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent signups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Users</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {downloads.filter(d => 
                d.userAgent?.includes('Mobile') || 
                d.userAgent?.includes('iPhone') || 
                d.userAgent?.includes('Android')
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Mobile downloads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(downloads.map(d => d.email)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique subscribers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Download Records</CardTitle>
          <CardDescription>
            View and manage trust document download signups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Downloaded</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDownloads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No downloads found matching your search.' : 'No downloads yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDownloads.map((download) => (
                    <TableRow key={download.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {download.firstName} {download.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{download.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(download.downloadedAt), 'MMM d, yyyy')}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(download.downloadedAt), 'h:mm a')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getDeviceInfo(download.userAgent)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono text-muted-foreground">
                          {download.ipAddress || 'N/A'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}