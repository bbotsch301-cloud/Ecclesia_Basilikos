import { Link } from "wouter";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export interface VerificationResult {
  found?: boolean;
  hashMatch: boolean;
  message: string;
  proof?: {
    id: string;
    status: string;
    createdAt: string;
    originalFilename?: string;
  };
  otsVerification?: {
    status: string;
    details: string;
    bitcoinBlockHeight?: number;
  };
}

interface VerificationResultDisplayProps {
  result: VerificationResult;
  showProofLink?: boolean;
}

export function VerificationResultDisplay({
  result,
  showProofLink = true,
}: VerificationResultDisplayProps) {
  const isMatch = result.found !== false && result.hashMatch;
  const isNotFound = result.found === false;

  const colorClasses = isMatch
    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
    : isNotFound
      ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";

  const titleColor = isMatch
    ? "text-green-700 dark:text-green-400"
    : isNotFound
      ? "text-gray-600 dark:text-gray-300"
      : "text-red-700 dark:text-red-400";

  const Icon = isMatch ? CheckCircle2 : isNotFound ? AlertCircle : XCircle;
  const iconColor = isMatch ? "text-green-500" : isNotFound ? "text-gray-400" : "text-red-500";

  const title = isMatch ? "MATCH FOUND" : isNotFound ? "NOT FOUND" : "NO MATCH";

  return (
    <div className={`rounded-xl p-6 border ${colorClasses}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-7 h-7 ${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-cinzel text-lg font-bold mb-1 ${titleColor}`}>
            {title}
          </h4>
          <p className="text-sm mb-3">{result.message}</p>

          {result.proof && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Proof ID:</span>
                {showProofLink ? (
                  <Link href={`/proof-vault/proofs/${result.proof.id}`}>
                    <span className="text-blue-600 hover:underline font-mono text-xs">
                      {result.proof.id}
                    </span>
                  </Link>
                ) : (
                  <span className="font-mono text-xs text-gray-600">
                    {result.proof.id}
                  </span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium capitalize">{result.proof.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(result.proof.createdAt).toLocaleString()}</span>
              </div>
              {result.proof.originalFilename && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Original file:</span>
                  <span className="truncate ml-2">{result.proof.originalFilename}</span>
                </div>
              )}
            </div>
          )}

          {result.otsVerification && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-sm space-y-1">
              <p className="font-medium">OpenTimestamps Verification</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {result.otsVerification.details}
              </p>
              {result.otsVerification.bitcoinBlockHeight && (
                <p className="text-xs">
                  <span className="font-medium">Bitcoin Block:</span>{" "}
                  <span className="font-mono text-green-600">
                    #{result.otsVerification.bitcoinBlockHeight}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
