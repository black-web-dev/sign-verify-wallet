declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      NEXT_PUBLIC_W3C_PID: string;
      NEXT_PUBLIC_SIGNIN_MESSAGE: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_API: string;
      SIWE_DOMAIN: string;
    }
  }
}

export {};
