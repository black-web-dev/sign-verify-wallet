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
import { useCheckStatus } from "@/hooks/useCheckStatus";

const Home = () => {
  const router = useRouter();

  const [mounted, setMounted] = useState<boolean>(false);
  const [requestNo, setRequestNo] = useState<string>("");

  const { address, isConnected } = useAccount();
  const { connectors, connect, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [hasSigned, setHasSigned] = useState(false);

  const { isChecking, message, status } = useCheckStatus(
    requestNo,
    address,
    isConnected
  );

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

  useEffect(() => {
    const requestNo = (router.query.slug && router.query.slug[0]) || "";
    setRequestNo(requestNo);
  }, [router]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>Loading</>;

  return (
    <main className="flex flex-auto flex-col items-center justify-center">
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
          <div className="flex flex-col gap-2 items-start">
            <div className="text-xl font-bold pb-2">Select a wallet</div>
            {connectors.map((connector: any) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                className="py-3 px-5 bg-blue-900 border border-transparent hover:border hover:border-blue-900 hover:bg-transparent"
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
            <button
              disabled={true}
              className="py-3 px-5 bg-blue-900 border border-transparent hover:border hover:border-blue-900 hover:bg-transparent"
            >
              <div className="flex items-center gap-2 min-w-[200px] justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={`/wallets/keplr.png`}
                    width={25}
                    height={25}
                    alt="wallet"
                  />
                  Keplr
                </div>
                <div className="text-sm text-gray-300">(unsupported)</div>
              </div>
            </button>
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
