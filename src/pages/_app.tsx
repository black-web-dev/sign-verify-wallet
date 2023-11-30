import Layout from "@/layout";
import "@/styles/globals.css";
import {
  ADDITIONAL_LINK_TAGS_SEO,
  ADDITIONAL_META_TAGS,
  OPENGRAPH,
  TWITTER_SEO,
} from "@/utils";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate={`%s | Cascadia Foundation`}
        title="Sign&Verify"
        description="Cascadia is a platform built to understand and incentivize positive consumer behavior."
        twitter={TWITTER_SEO}
        additionalLinkTags={ADDITIONAL_LINK_TAGS_SEO}
        additionalMetaTags={ADDITIONAL_META_TAGS}
        openGraph={OPENGRAPH}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
