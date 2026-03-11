import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  Search,
  Crown,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Edit,
  ArrowUpDown,
  Loader2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/admin-layout";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Subscriber {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  subscriptionStatus: string;
  subscriptionTier: string;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
}

interface SubscriptionStats {
  totalPremium: number;
  totalFree: number;
  recentSubscriptions: number;
  churnRate: number;
}

type SortField = "name" | "status" | "startDate" | "endDate";
type SortDirection = "asc" | "desc";

export default function AdminSubscribers() {
  usePageTitle("Admin - Subscribers");
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState("active");
  const [editPlan, setEditPlan] = useState("premium");
  const [editEndDate, setEditEndDate] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { data: subscribers, isLoading: subscribersLoading } = useQuery<Subscriber[]>({
    queryKey: ['/api/admin/subscribers'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: stats, isLoading: statsLoading } = useQuery<SubscriptionStats>({
    queryKey: ['/api/admin/subscription-stats'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, status, plan, endDate }: { userId: string; status: string; plan: string; endDate: string | null }) => {
      return apiRequest('PATCH', `/api/admin/subscribers/${userId}`, { status, plan, endDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscription-stats'] });
      toast({
        title: "Subscription Updated",
        description: "User subscription has been updated successfully.",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const openEditDialog = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setEditStatus(subscriber.subscriptionStatus === 'none' ? 'active' : subscriber.subscriptionStatus);
    setEditPlan(subscriber.subscriptionTier || 'free');
    setEditEndDate(subscriber.subscriptionEndDate ? subscriber.subscriptionEndDate.split('T')[0] : '');
    setIsEditDialogOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    if (!subscribers) return [];

    let filtered = subscribers.filter(sub => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        sub.firstName.toLowerCase().includes(term) ||
        sub.lastName.toLowerCase().includes(term) ||
        sub.email.toLowerCase().includes(term)
      );
    });

    filtered.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "name":
          return dir * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "status":
          return dir * (a.subscriptionStatus || '').localeCompare(b.subscriptionStatus || '');
        case "startDate":
          return dir * ((a.subscriptionStartDate || '').localeCompare(b.subscriptionStartDate || ''));
        case "endDate":
          return dir * ((a.subscriptionEndDate || '').localeCompare(b.subscriptionEndDate || ''));
        default:
          return 0;
      }
    });

    return filtered;
  }, [subscribers, searchTerm, sortField, sortDirection]);

  const getStatusBadge = (status: string, tier: string) => {
    if (tier === 'premium' && status === 'active') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
    }
    if (status === 'cancelled') {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Cancelled</Badge>;
    }
    if (status === 'expired') {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Expired</Badge>;
    }
    if (status === 'trialing') {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Trialing</Badge>;
    }
    return <Badge variant="outline" className="text-gray-500">Free</Badge>;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "\u2014";
    return new Date(dateStr).toLocaleDateString();
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3 text-gray-400" />
      </div>
    </TableHead>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage user subscriptions and view analytics</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Premium</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoading ? "..." : stats?.totalPremium ?? 0}
                  </p>
                </div>
                <Crown className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Free</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoading ? "..." : stats?.totalFree ?? 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoading ? "..." : stats?.recentSubscriptions ?? 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Churn Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoading ? "..." : `${stats?.churnRate ?? 0}%`}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              All Users - Subscription Status
            </CardTitle>
            <CardDescription>
              View and manage subscription status for all users ({filteredAndSorted.length} shown)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscribersLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading subscribers...</p>
              </div>
            ) : filteredAndSorted.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader field="name">User Name</SortableHeader>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <SortableHeader field="status">Status</SortableHeader>
                    <SortableHeader field="startDate">Start Date</SortableHeader>
                    <SortableHeader field="endDate">End Date</SortableHeader>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSorted.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="font-medium">{sub.firstName} {sub.lastName}</div>
                      </TableCell>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>
                        {sub.subscriptionTier === 'premium' ? (
                          <Badge className="bg-royal-gold text-royal-navy text-xs">
                            <Crown className="w-3 h-3 mr-1" /> Premium
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(sub.subscriptionStatus, sub.subscriptionTier)}
                      </TableCell>
                      <TableCell>{formatDate(sub.subscriptionStartDate)}</TableCell>
                      <TableCell>{formatDate(sub.subscriptionEndDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(sub)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No subscribers found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Subscription Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subscription</DialogTitle>
              <DialogDescription>
                Manually update subscription for {selectedSubscriber?.firstName} {selectedSubscriber?.lastName} ({selectedSubscriber?.email})
              </DialogDescription>
            </DialogHeader>

            {selectedSubscriber && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-plan">Plan</Label>
                  <Select value={editPlan} onValueChange={setEditPlan}>
                    <SelectTrigger id="edit-plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-end-date">End Date</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no end date</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedSubscriber) {
                    updateSubscriptionMutation.mutate({
                      userId: selectedSubscriber.id,
                      status: editStatus,
                      plan: editPlan,
                      endDate: editEndDate || null,
                    });
                  }
                }}
                disabled={updateSubscriptionMutation.isPending}
              >
                {updateSubscriptionMutation.isPending ? "Updating..." : "Update Subscription"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
