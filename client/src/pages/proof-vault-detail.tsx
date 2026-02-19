import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import type { Proof } from "@shared/schema";
import {
  Shield,
  ArrowLeft,
  Download,
  ArrowUpCircle,
  FileCheck,
  Hash,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Loader2,
  Calendar,
  Lock,
  LogIn,
  Upload,
  AlertCircle,
  Bitcoin,
} from "lucide-react";

interface ProofWithOtsInfo extends Proof {
  otsInfo?: {
    status: string;
    calendarUrls: string[];
    bitcoinAttestations: Array<{ blockHeight: number }>;
  };
}

function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-300 text-sm px-3 py-1">
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Confirmed on Bitcoin
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-sm px-3 py-1">
          <Clock className="w-4 h-4 mr-1" />
          Pending Confirmation
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-300 text-sm px-3 py-1">
          <XCircle className="w-4 h-4 mr-1" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

export default function ProofVaultDetail() {
  const [, params] = useRoute("/proof-vault/proofs/:id");
  const proofId = params?.id;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Verification state
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [showVerify, setShowVerify] = useState(false);
  const verifyFileInputRef = useRef<HTMLInputElement>(null);

  const { data: proof, isLoading } = useQuery<ProofWithOtsInfo>({
    queryKey: [`/api/proof-vault/proofs/${proofId}`],
    enabled: isAuthenticated && !!proofId,
  });

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/proof-vault/proofs/${proofId}/upgrade`);
    },
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries({
        queryKey: [`/api/proof-vault/proofs/${proofId}`],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/proof-vault/proofs"] });
      toast({
        title: data.proof?.status === "confirmed" ? "Proof Confirmed" : "Upgrade Attempted",
        description: data.message,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upgrade proof",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (verifyFile) {
        const formData = new FormData();
        formData.append("file", verifyFile);
        formData.append("proofId", proofId || "");

        const res = await fetch("/api/proof-vault/verify", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Verification failed");
        }

        return res.json();
      } else if (verifyHash) {
        const res = await fetch("/api/proof-vault/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sha256: verifyHash.toLowerCase(),
            proofId: proofId,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Verification failed");
        }

        return res.json();
      }
      throw new Error("Provide a file or hash to verify");
    },
    onSuccess: (data) => {
      setVerifyResult(data);
    },
    onError: (err: Error) => {
      toast({
        title: "Verification Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard` });
  };

  if (authLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-16">
        <div className="max-w-lg mx-auto px-4 py-32 text-center">
          <Lock className="w-16 h-16 text-royal-gold mx-auto mb-6" />
          <h2 className="font-cinzel text-2xl font-bold text-royal-navy dark:text-royal-gold mb-4">
            Authentication Required
          </h2>
          <Link href="/">
            <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (!proof) {
    return (
      <div className="pt-16">
        <div className="max-w-lg mx-auto px-4 py-32 text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="font-cinzel text-2xl font-bold text-royal-navy dark:text-royal-gold mb-4">
            Proof Not Found
          </h2>
          <Link href="/proof-vault">
            <Button variant="outline" className="font-cinzel">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Proof Vault
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-10 md:py-14">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <StatusBadge status={proof.status} />
          <h1 className="font-cinzel-decorative text-2xl md:text-3xl font-bold text-white mt-4 mb-2 leading-tight">
            {proof.label || proof.originalFilename || "Proof Receipt"}
          </h1>
          <p className="text-sm text-gray-300">
            Created {proof.createdAt ? new Date(proof.createdAt).toLocaleString() : "Unknown"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/proof-vault">
            <Button variant="ghost" size="sm" className="font-cinzel">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {proof.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => upgradeMutation.mutate()}
                disabled={upgradeMutation.isPending}
                className="font-cinzel"
              >
                {upgradeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                )}
                Upgrade Proof
              </Button>
            )}
            <a
              href={`/api/proof-vault/proofs/${proof.id}/bundle`}
              download
            >
              <Button size="sm" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                <Download className="w-4 h-4 mr-2" />
                Download Bundle
              </Button>
            </a>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Proof Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-cinzel flex items-center gap-2">
                <Shield className="w-5 h-5 text-royal-gold" />
                Proof Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* SHA-256 Hash */}
              <div>
                <Label className="text-xs text-gray-500 font-cinzel">SHA-256 Hash</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded flex-1 break-all">
                    {proof.sha256}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(proof.sha256, "Hash")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 font-cinzel">Mode</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {proof.mode === "file" ? (
                      <FileCheck className="w-4 h-4 text-royal-gold" />
                    ) : (
                      <Hash className="w-4 h-4 text-royal-gold" />
                    )}
                    <span className="text-sm font-medium capitalize">{proof.mode}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 font-cinzel">Provider</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Bitcoin className="w-4 h-4 text-royal-gold" />
                    <span className="text-sm font-medium">OpenTimestamps</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 font-cinzel">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={proof.status} />
                  </div>
                </div>

                {proof.originalFilename && (
                  <div>
                    <Label className="text-xs text-gray-500 font-cinzel">Original File</Label>
                    <p className="text-sm font-medium mt-1 truncate">{proof.originalFilename}</p>
                  </div>
                )}

                {proof.mimeType && (
                  <div>
                    <Label className="text-xs text-gray-500 font-cinzel">MIME Type</Label>
                    <p className="text-sm font-medium mt-1">{proof.mimeType}</p>
                  </div>
                )}

                {proof.sizeBytes && (
                  <div>
                    <Label className="text-xs text-gray-500 font-cinzel">File Size</Label>
                    <p className="text-sm font-medium mt-1">
                      {(proof.sizeBytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-xs text-gray-500 font-cinzel">Created</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">
                      {proof.createdAt
                        ? new Date(proof.createdAt).toLocaleString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                {proof.lastUpgradeAttemptAt && (
                  <div>
                    <Label className="text-xs text-gray-500 font-cinzel">Last Upgrade</Label>
                    <span className="text-sm mt-1 block">
                      {new Date(proof.lastUpgradeAttemptAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {proof.label && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs text-gray-500 font-cinzel">Label</Label>
                    <p className="text-sm mt-1">{proof.label}</p>
                  </div>
                </>
              )}

              {proof.errorMessage && (
                <>
                  <Separator />
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-700 dark:text-red-300">
                        <p className="font-medium">Error</p>
                        <p>{proof.errorMessage}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* OTS Info */}
              {proof.otsInfo && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs text-gray-500 font-cinzel">OpenTimestamps Details</Label>
                    <div className="mt-2 space-y-2">
                      {proof.otsInfo.calendarUrls.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500">Calendar servers: </span>
                          {proof.otsInfo.calendarUrls.map((url, i) => (
                            <span key={i} className="text-blue-600 text-xs font-mono">
                              {i > 0 && ", "}
                              {url}
                            </span>
                          ))}
                        </div>
                      )}
                      {proof.otsInfo.bitcoinAttestations.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500">Bitcoin block: </span>
                          <span className="font-mono font-medium text-green-600">
                            #{proof.otsInfo.bitcoinAttestations[0].blockHeight}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Proof ID */}
              <Separator />
              <div>
                <Label className="text-xs text-gray-500 font-cinzel">Proof ID</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono text-xs text-gray-500">{proof.id}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(proof.id, "Proof ID")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Proof Info */}
          {proof.status === "pending" && (
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-cinzel font-bold text-yellow-700 dark:text-yellow-400 mb-1">
                      Awaiting Bitcoin Confirmation
                    </h3>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-3">
                      Your proof has been submitted to OpenTimestamps calendar servers but is not yet
                      anchored to the Bitcoin blockchain. This typically takes a few hours. Click
                      "Upgrade Proof" to check for confirmation.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => upgradeMutation.mutate()}
                      disabled={upgradeMutation.isPending}
                      className="border-yellow-400 text-yellow-700 hover:bg-yellow-100 font-cinzel"
                    >
                      {upgradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                      )}
                      Check for Confirmation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-cinzel flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-royal-gold" />
                  Verify Against This Proof
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowVerify(!showVerify);
                    setVerifyResult(null);
                    setVerifyFile(null);
                    setVerifyHash("");
                  }}
                  className="font-cinzel"
                >
                  {showVerify ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            {showVerify && (
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a file or paste a SHA-256 hash to verify it matches this proof.
                </p>

                <div>
                  <Label className="text-sm font-cinzel mb-2 block">Upload File</Label>
                  <div
                    onClick={() => verifyFileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-royal-gold/50 transition-colors"
                  >
                    <input
                      ref={verifyFileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVerifyFile(file);
                          setVerifyHash("");
                        }
                      }}
                    />
                    {verifyFile ? (
                      <p className="text-sm font-medium">{verifyFile.name}</p>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Click to select file</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-gray-400 font-cinzel">OR</span>
                  <Separator className="flex-1" />
                </div>

                <div>
                  <Label className="text-sm font-cinzel mb-2 block">Paste SHA-256 Hash</Label>
                  <Input
                    placeholder="64-character hex hash"
                    value={verifyHash}
                    onChange={(e) => {
                      setVerifyHash(e.target.value.trim());
                      setVerifyFile(null);
                    }}
                    className="font-mono text-sm"
                    maxLength={64}
                  />
                </div>

                <Button
                  onClick={() => verifyMutation.mutate()}
                  disabled={
                    (!verifyFile && !/^[a-fA-F0-9]{64}$/.test(verifyHash)) ||
                    verifyMutation.isPending
                  }
                  className="w-full font-cinzel"
                  variant="outline"
                >
                  {verifyMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileCheck className="w-4 h-4 mr-2" />
                  )}
                  Verify
                </Button>

                {/* Verification Result */}
                {verifyResult && (
                  <div
                    className={`rounded-lg p-4 border ${
                      verifyResult.hashMatch
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {verifyResult.hashMatch ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <h4
                          className={`font-cinzel font-bold mb-1 ${
                            verifyResult.hashMatch
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {verifyResult.hashMatch ? "MATCH" : "NO MATCH"}
                        </h4>
                        <p
                          className={`text-sm ${
                            verifyResult.hashMatch
                              ? "text-green-600 dark:text-green-300"
                              : "text-red-600 dark:text-red-300"
                          }`}
                        >
                          {verifyResult.message}
                        </p>
                        {verifyResult.otsVerification && (
                          <div className="mt-2 text-xs space-y-1">
                            <p>
                              <span className="font-medium">Proof Status:</span>{" "}
                              {verifyResult.otsVerification.status}
                            </p>
                            <p>
                              <span className="font-medium">Details:</span>{" "}
                              {verifyResult.otsVerification.details}
                            </p>
                            {verifyResult.otsVerification.bitcoinBlockHeight && (
                              <p>
                                <span className="font-medium">Bitcoin Block:</span>{" "}
                                #{verifyResult.otsVerification.bitcoinBlockHeight}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
