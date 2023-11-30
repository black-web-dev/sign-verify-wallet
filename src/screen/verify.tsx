import LoadingIndicator from "@/components/loadingIndicator";
import { useCheckStatus } from "@/hooks/useCheckStatus";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const Verify = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [requestNo, setRequestNo] = useState<string>("");

  const { isChecking, isLoading, message, status, handleVerify } =
    useCheckStatus(requestNo, address, isConnected);

  useEffect(() => {
    const requestNo = (router.query.slug && router.query.slug[0]) || "";
    setRequestNo(requestNo);
  }, [router]);

  return (
    <main className="flex-auto container mx-auto flex flex-col justify-center items-center">
      <div className="flex flex-col gap-5 items-center">
        {isChecking && !message && <LoadingIndicator />}
        {message && (
          <div className="text-white text-xl p-5 bg-gray-900">{message}</div>
        )}

        {status < 1 && (
          <button
            className="min-w-[150px] py-2 px-4 bg-blue-900 border border-blue-900 hover:bg-transparent active:scale-95"
            onClick={handleVerify}
          >
            {isLoading ? <LoadingIndicator /> : "Verify"}
          </button>
        )}
      </div>
    </main>
  );
};

export default Verify;
