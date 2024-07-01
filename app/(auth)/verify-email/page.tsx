"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { trpc } from "@/trpc/client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyEmail = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setVerificationStatus("success");
      setTimeout(() => {
        router.push("/login");
      }, 3000); // Redirect to login page after 3 seconds
    },
    onError: (error) => {
      setVerificationStatus("error");
      setErrorMessage(error.message);
    },
  });

  useEffect(() => {
    if (token) {
      setVerificationStatus("loading");
      verifyEmail.mutate({ token });
    } else {
      setVerificationStatus("error");
      setErrorMessage("No verification token provided");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {verificationStatus === "idle" && <p>Please wait...</p>}
        {verificationStatus === "loading" && <p>Verifying your email...</p>}
        {verificationStatus === "success" && (
          <div>
            <p className="text-green-600">
              Your email has been successfully verified!
            </p>
            <p>Redirecting you to the login page...</p>
          </div>
        )}
        {verificationStatus === "error" && (
          <div>
            <p className="text-red-600">Error verifying email:</p>
            <p>{errorMessage}</p>
            <p className="mt-4">
              Please try again or contact support if the problem persists.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
