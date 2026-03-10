import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, Users, Search, Loader2, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/admin-layout";
import { usePageTitle } from "@/hooks/usePageTitle";

interface SubscriptionStats {
  totalPremium: number;
  totalFree: number;
  recentSubscriptions: number;
}

interface UserWithSub {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  subscriptionStartDate: string | null;
  premiumGrantedAt: string | null;
  createdAt: string;
}

export default function AdminSubscribers() {
  usePageTitle("Admin - Subscribers");
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "premium" | "free">("all");

  const { data: stats, isLoading: statsLoading } = useQuery<SubscriptionStats>({
    queryKey: ["/api/admin/subscription-stats"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: allUsers = [], isLoading: usersLoading } = useQuery<UserWithSub[]>({
    queryKey: ["/api/admin/users"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: "grant" | "revoke" }) => {
      return apiRequest("PATCH", `/api/admin/users/${userId}/subscription`, { action });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscription-stats"] });
      toast({ title: "Subscription Updated", description: "User subscription has been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch = !searchTerm ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

    const isPremium = u.subscriptionTier === "premium" && u.subscriptionStatus === "active";
    const matchesTier =
      tierFilter === "all" ||
      (tierFilter === "premium" && isPremium) ||
      (tierFilter === "free" && !isPremium);

    return matchesSearch && matchesTier;
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-cinzel-decorative text-3xl font-bold text-royal-navy mb-8">Subscription Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 text-royal-gold mx-auto mb-2" />
              <p className="text-3xl font-bold text-royal-navy">{statsLoading ? "..." : stats?.totalPremium ?? 0}</p>
              <p className="text-sm text-gray-500 font-cinzel">Premium Subscribers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-royal-navy">{statsLoading ? "..." : stats?.totalFree ?? 0}</p>
              <p className="text-sm text-gray-500 font-cinzel">Free Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-royal-navy">{statsLoading ? "..." : stats?.recentSubscriptions ?? 0}</p>
              <p className="text-sm text-gray-500 font-cinzel">Last 30 Days</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "premium", "free"] as const).map((t) => (
                <Button
                  key={t}
                  variant={tierFilter === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTierFilter(t)}
                  className={tierFilter === t ? "bg-royal-navy" : ""}
                >
                  {t === "all" ? "All" : t === "premium" ? "Premium" : "Free"}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {usersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Since</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => {
                    const isPrem = u.subscriptionTier === "premium" && u.subscriptionStatus === "active";
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.firstName} {u.lastName}</TableCell>
                        <TableCell className="text-sm text-gray-500">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs capitalize">{u.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {isPrem ? (
                            <Badge className="bg-royal-gold text-royal-navy text-xs">
                              <Crown className="w-3 h-3 mr-1" /> Premium
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Free</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {u.premiumGrantedAt
                            ? new Date(u.premiumGrantedAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {u.role !== "admin" && (
                            <Button
                              size="sm"
                              variant={isPrem ? "outline" : "default"}
                              className={isPrem ? "text-red-600 border-red-200 hover:bg-red-50" : "bg-royal-gold hover:bg-royal-gold/90 text-royal-navy"}
                              onClick={() => toggleMutation.mutate({
                                userId: u.id,
                                action: isPrem ? "revoke" : "grant",
                              })}
                              disabled={toggleMutation.isPending}
                            >
                              {isPrem ? (
                                <><UserX className="w-3 h-3 mr-1" /> Revoke</>
                              ) : (
                                <><UserCheck className="w-3 h-3 mr-1" /> Grant Premium</>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
