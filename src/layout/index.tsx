import CustomAppbar from "@/components/customAppbar";
import Providers from "@/providers";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <CustomAppbar />
        {children}
      </div>
    </Providers>
  );
};

export default Layout;
