import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, CreditCard, Calendar, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import PremiumBadge from "@/components/PremiumBadge";
import RequireAuth from "@/components/RequireAuth";

interface SubscriptionStatus {
  tier: string;
  status: string;
  isPremium: boolean;
  startDate: string | null;
  endDate: string | null;
  features: Record<string, boolean>;
}

interface SubscriptionRecord {
  id: string;
  tier: string;
  status: string;
  source: string;
  startDate: string;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
}

function BillingContent() {
  usePageTitle("Billing");
  const { user, isPremium } = useAuth();

  const { data: subStatus, isLoading: statusLoading } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription/status"],
  });

  const { data: history = [], isLoading: historyLoading } = useQuery<SubscriptionRecord[]>({
    queryKey: ["/api/subscription/history"],
  });

  if (statusLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 marble-bg">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-cinzel-decorative text-3xl font-bold text-royal-navy mb-8">Billing & Subscription</h1>

        {/* Current Plan */}
        <Card className="mb-8 border-2 border-royal-gold/20">
          <CardHeader>
            <CardTitle className="font-cinzel flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-royal-gold" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-cinzel text-xl font-bold text-royal-navy">
                    {isPremium ? "Royal Assembly" : "Citizen (Free)"}
                  </h3>
                  {isPremium && <PremiumBadge size="md" />}
                </div>
                <p className="text-sm text-gray-500">
                  {isPremium
                    ? "You have full access to all content and features."
                    : "You have access to Trust content. Upgrade for full access."
                  }
                </p>
                {subStatus?.startDate && (
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Member since {new Date(subStatus.startDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {!isPremium && (
                <Link href="/pricing">
                  <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                    <Crown className="w-4 h-4 mr-2" /> Upgrade
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Manage Subscription */}
        {isPremium && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-cinzel text-lg">Manage Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Subscription management via Stripe is coming soon. Contact support for any changes.
              </p>
              <Button variant="outline" disabled className="font-cinzel">
                Manage via Stripe (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Subscription History */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cinzel text-lg">Subscription History</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No subscription history yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.tier === 'premium' ? 'default' : 'secondary'} className={record.tier === 'premium' ? 'bg-royal-gold text-royal-navy' : ''}>
                          {record.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm capitalize">{record.status}</TableCell>
                      <TableCell className="text-sm capitalize">{record.source.replace('_', ' ')}</TableCell>
                      <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">{record.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Billing() {
  return (
    <RequireAuth>
      <BillingContent />
    </RequireAuth>
  );
}
