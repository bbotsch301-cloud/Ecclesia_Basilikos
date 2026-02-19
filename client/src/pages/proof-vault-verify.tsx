import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Shield,
  ArrowLeft,
  FileCheck,
  Upload,
  Hash,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  LogIn,
  Search,
  AlertCircle,
} from "lucide-react";

export default function ProofVaultVerify() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidHash = /^[a-fA-F0-9]{64}$/.test(verifyHash);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (verifyFile) {
        const formData = new FormData();
        formData.append("file", verifyFile);

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
          body: JSON.stringify({ sha256: verifyHash.toLowerCase() }),
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

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-12 md:py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-base backdrop-blur-sm">
            Verify
          </Badge>
          <h1 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Verify a Proof
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Upload a file or paste a hash to check if it matches an existing timestamped proof.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/proof-vault">
          <Button variant="ghost" size="sm" className="mb-6 font-cinzel">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proof Vault
          </Button>
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-cinzel flex items-center gap-2">
              <Search className="w-5 h-5 text-royal-gold" />
              Verification Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div>
              <Label className="font-cinzel text-sm font-medium mb-2 block">
                Upload File to Verify
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-royal-gold/50 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVerifyFile(file);
                      setVerifyHash("");
                      setVerifyResult(null);
                    }
                  }}
                />
                {verifyFile ? (
                  <div>
                    <FileCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-sm">{verifyFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(verifyFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Click to select a file
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-gray-400 font-cinzel">OR</span>
              <Separator className="flex-1" />
            </div>

            {/* Hash Input */}
            <div>
              <Label className="font-cinzel text-sm font-medium mb-2 block">
                Paste SHA-256 Hash
              </Label>
              <Input
                placeholder="e.g., e3b0c44298fc1c149afbf4c8996fb924..."
                value={verifyHash}
                onChange={(e) => {
                  setVerifyHash(e.target.value.trim());
                  setVerifyFile(null);
                  setVerifyResult(null);
                }}
                className="font-mono text-sm"
                maxLength={64}
              />
              {verifyHash && !isValidHash && (
                <p className="text-sm text-red-500 mt-1">
                  Enter a valid 64-character hexadecimal SHA-256 hash
                </p>
              )}
            </div>

            <Button
              onClick={() => verifyMutation.mutate()}
              disabled={
                (!verifyFile && !isValidHash) || verifyMutation.isPending
              }
              className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold py-6"
            >
              {verifyMutation.isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Shield className="w-5 h-5 mr-2" />
              )}
              Verify
            </Button>

            {/* Result */}
            {verifyResult && (
              <div
                className={`rounded-xl p-6 border ${
                  verifyResult.found && verifyResult.hashMatch
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : verifyResult.found
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  {verifyResult.found && verifyResult.hashMatch ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : verifyResult.found ? (
                    <XCircle className="w-8 h-8 text-red-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`font-cinzel text-xl font-bold mb-2 ${
                        verifyResult.found && verifyResult.hashMatch
                          ? "text-green-700 dark:text-green-400"
                          : verifyResult.found
                            ? "text-red-700 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {verifyResult.found && verifyResult.hashMatch
                        ? "MATCH FOUND"
                        : verifyResult.found
                          ? "NO MATCH"
                          : "NOT FOUND"}
                    </h3>
                    <p className="text-sm mb-3">{verifyResult.message}</p>

                    {verifyResult.proof && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Proof ID:</span>
                          <Link href={`/proof-vault/proofs/${verifyResult.proof.id}`}>
                            <span className="text-blue-600 hover:underline font-mono text-xs">
                              {verifyResult.proof.id}
                            </span>
                          </Link>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <span className="font-medium capitalize">
                            {verifyResult.proof.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created:</span>
                          <span>
                            {new Date(verifyResult.proof.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {verifyResult.proof.originalFilename && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Original file:</span>
                            <span>{verifyResult.proof.originalFilename}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {verifyResult.otsVerification && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-sm">
                        <p className="font-medium mb-1">OpenTimestamps Verification</p>
                        <p className="text-xs">{verifyResult.otsVerification.details}</p>
                        {verifyResult.otsVerification.bitcoinBlockHeight && (
                          <p className="text-xs mt-1">
                            Bitcoin Block: #{verifyResult.otsVerification.bitcoinBlockHeight}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
