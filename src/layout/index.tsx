import Providers from "@/providers";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Providers>{children}</Providers>;
};

export default Layout;
