import { useCallback, useState, useEffect } from "react";

export const useCheckStatus = (
  requestNo: string,
  address: `0x${string}` | undefined,
  isConnected: boolean
) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number>(-1);
  const [message, setMessage] = useState<string>("");

  const checkStatus = useCallback(
    (
      requestNo: string,
      address: `0x${string}` | undefined,
      isConnected: boolean
    ) => {
      if (requestNo && address && isConnected) {
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

  useEffect(() => {
    checkStatus(requestNo, address, isConnected);

    const timeoutId = setInterval(() => {
      checkStatus(requestNo, address, isConnected);
    }, 10 * 1000);

    return () => clearTimeout(timeoutId);
  }, [requestNo, address, isConnected, checkStatus]);

  return {
    isChecking,
    isLoading,
    status,
    message,
    handleVerify,
  };
};
