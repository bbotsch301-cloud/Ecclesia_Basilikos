import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Users, Calendar, Percent, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import RequireAuth from "@/components/RequireAuth";
import { useState } from "react";

interface BeneficialUnitData {
  id: string;
  userId: string;
  unitNumber: number;
  issuedAt: string;
  status: string;
  totalActiveBeneficiaries: number;
  percentage: string;
}

function BeneficialUnitContent() {
  usePageTitle("Your Beneficial Unit");
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: unit, isLoading } = useQuery<BeneficialUnitData>({
    queryKey: ["/api/beneficiary/unit"],
  });

  const handleDownloadCertificate = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/beneficiary/unit/certificate", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to download certificate");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `beneficial-unit-${unit?.unitNumber || "certificate"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="font-cinzel-decorative text-2xl font-bold text-royal-navy mb-2">No Beneficial Unit Found</h1>
          <p className="text-gray-500">Your beneficial unit has not been issued yet. Please contact support.</p>
        </div>
      </div>
    );
  }

  const issuedDate = new Date(unit.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-royal-navy to-royal-burgundy text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Award className="w-12 h-12 text-royal-gold mx-auto mb-4" />
          <h1 className="font-cinzel-decorative text-3xl font-bold mb-2">Your Beneficial Unit</h1>
          <p className="text-gray-300">Ecclesia Basilikos Trust Instrument</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Unit Details Card */}
        <Card className="border-2 border-royal-gold/20">
          <CardHeader>
            <CardTitle className="font-cinzel flex items-center gap-2">
              <Award className="w-5 h-5 text-royal-gold" />
              Beneficial Unit #{unit.unitNumber}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Issued</p>
                    <p className="font-medium">{issuedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Total Active Beneficiaries</p>
                    <p className="font-medium">{unit.totalActiveBeneficiaries}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Percent className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Your Beneficial Interest</p>
                    <p className="font-medium">1/{unit.totalActiveBeneficiaries} ({unit.percentage}%)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button
                onClick={handleDownloadCertificate}
                disabled={isDownloading}
                className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold"
              >
                {isDownloading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                ) : (
                  <><Download className="w-4 h-4 mr-2" /> Download Certificate</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trust Corpus Description */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cinzel text-lg">Trust Corpus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your Beneficial Unit represents an equal and undivided interest in the Ecclesia Basilikos Trust corpus,
              which comprises all assets of the Trust including:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-royal-gold mt-1">•</span>
                <span>Educational content, courses, and teachings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-royal-gold mt-1">•</span>
                <span>Platform resources and infrastructure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-royal-gold mt-1">•</span>
                <span>Community assets and forum discussions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-royal-gold mt-1">•</span>
                <span>Financial contributions and trust administration</span>
              </li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              The proportional interest (1/N) recalculates dynamically as membership grows, ensuring all
              Beneficiaries maintain an equal share.
            </p>
          </CardContent>
        </Card>

        {/* Link to PMA Agreement */}
        <div className="text-center text-sm text-gray-500">
          This unit is issued pursuant to the{" "}
          <Link href="/pma-agreement" className="text-royal-gold hover:underline font-medium">
            PMA Membership Agreement
          </Link>.
        </div>
      </div>
    </div>
  );
}

export default function BeneficialUnit() {
  return (
    <RequireAuth>
      <BeneficialUnitContent />
    </RequireAuth>
  );
}
