import React from "react";
import Image from "next/image";
import SignoutButton from "./signoutButton";
import { useRouter } from "next/router";

const CustomAppbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-none">
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://cascadia.foundation.com/"
          className="flex items-center"
        >
          <Image src={"/logo.svg"} width={200} height={100} alt="logo" />
        </a>

        {router.pathname.includes("verify") && (
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0">
              <li>
                <SignoutButton />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CustomAppbar;
