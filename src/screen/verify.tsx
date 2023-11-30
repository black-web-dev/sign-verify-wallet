import CustomAppbar from "@/components/customAppbar";
import LoadingIndicator from "@/components/loadingIndicator";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

const Verify = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [requestNo, setRequestNo] = useState<string>("");
  const [status, setStatus] = useState<number>(-1);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleVerify = () => {
    if (requestNo && address) {
      setIsLoading(true);

      fetch(`/api/verifyWallet?requestNo=${requestNo}&address=${address}`)
        .then((response) => response.json())
        .then(({ status, message }) => {
          setStatus(status);
          setMessage(message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const checkStatus = useCallback(
    (requestNo: string, address: `0x${string}` | undefined) => {
      console.log(11222);
      if (requestNo && address) {
        setIsChecking(true);

        fetch(`/api/checkStatus?requestNo=${requestNo}&address=${address}`)
          .then((response) => response.json())
          .then(({ status, message }) => {
            setStatus(status);
            setMessage(message);
          })
          .finally(() => {
            setIsChecking(false);
          });
      }
    },
    []
  );

  useEffect(() => {
    checkStatus(requestNo, address);

    const timeoutId = setInterval(() => {
      checkStatus(requestNo, address);
    }, 10 * 1000);

    return () => clearTimeout(timeoutId);
  }, [requestNo, address, checkStatus]);

  useEffect(() => {
    const requestNo = (router.query.slug && router.query.slug[0]) || "";

    setRequestNo(requestNo);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomAppbar />

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
    </div>
  );
};

export default Verify;
