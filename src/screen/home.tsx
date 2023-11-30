import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa";

import { SiweMessage } from "siwe";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { polygonMumbai } from "viem/chains";
import { useAccount, useSignMessage, useConnect, useDisconnect } from "wagmi";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingIndicator from "@/components/loadingIndicator";
import Avatar from "@/components/identicon";

const Home = () => {
  const router = useRouter();

  const [mounted, setMounted] = useState<boolean>(false);
  const [requestNo, setRequestNo] = useState<string>("");
  const [status, setStatus] = useState<number>(-1);
  const [message, setMessage] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const { address, isConnected } = useAccount();
  const { connectors, connect, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [hasSigned, setHasSigned] = useState(false);

  const handleSign = useCallback(async () => {
    if (!isConnected) await connect();

    try {
      const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        address: address,
        statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
        nonce: await getCsrfToken(),
        chainId: polygonMumbai.id,
      });

      const signedMessage = await signMessageAsync({
        message: message.prepareMessage(),
      });

      setHasSigned(true);

      const response = await signIn("web3", {
        message: JSON.stringify(message),
        signedMessage,
        redirect: true,
        callbackUrl: `/verify/${requestNo}`,
      });
      if (response?.error) {
        console.log("Error occured:", response.error);
      }
    } catch (error) {
      console.log("Error Occured", error);
    }
  }, [address, connect, isConnected, signMessageAsync, requestNo]);

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
    const requestNo = (router.query.slug && router.query.slug[0]) || "";

    setRequestNo(requestNo);
  }, [router]);

  useEffect(() => {
    checkStatus(requestNo, address);

    const timeoutId = setInterval(() => {
      checkStatus(requestNo, address);
    }, 10 * 1000);

    return () => clearTimeout(timeoutId);
  }, [requestNo, address, checkStatus]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>Loading</>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {!requestNo && (
        <div className="flex flex-col gap-2">
          <div className="text-xl">Invalid Request Number</div>
          <button className="flex items-center justify-center gap-2 min-w-[150px] py-2 px-4 bg-blue-900 border border-blue-900 hover:bg-transparent active:scale-95">
            <FaDiscord />
            <div>Generate Link</div>
          </button>
        </div>
      )}
      {requestNo && !isConnected && (
        <>
          <div className="flex flex-col gap-2">
            {connectors.map((connector: any) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                className="py-2 px-4 bg-blue-900 border border-transparent hover:border hover:border-blue-900 hover:bg-transparent"
                onClick={() => connect({ connector })}
              >
                <div className="flex items-center gap-2 min-w-[200px] justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/wallets/${connector.name}.png`}
                      width={25}
                      height={25}
                      alt="wallet"
                    />
                    {connector.name}
                  </div>
                  {!connector.ready && " (unsupported)"}
                  {isLoading && connector.id === pendingConnector?.id && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
      {requestNo && isConnected && !hasSigned && (
        <div className="flex flex-col gap-5 justify-center items-center">
          {isChecking && !message && <LoadingIndicator />}
          {message && (
            <div className="text-white text-xl p-5 bg-gray-900">{message}</div>
          )}
          <div className="flex gap-2 items-center">
            <div className="text-xl font-semibold text-gray-400 flex items-center gap-2">
              <Avatar address={address || ""} />
              <div>
                {address?.slice(0, 10)}...{address?.slice(-4)}
              </div>
            </div>
          </div>
          {status >= 0 && (
            <div className="flex items-center gap-2">
              <button
                className="py-2 px-4 bg-blue-900 border border-blue-900 hover:bg-transparent active:scale-95"
                onClick={handleSign}
              >
                Sign Message
              </button>
              <button
                className="py-2 px-4 bg-transparent border border-blue-900 hover:border hover:bg-blue-900 active:scale-95"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
      {requestNo && isConnected && hasSigned && (
        <p>You are being authenticated. Please wait...</p>
      )}
    </main>
  );
};

export default Home;
