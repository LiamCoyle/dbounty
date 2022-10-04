import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ThemeProvider } from "../contexts/themeContext";
import { BountiesProvider } from "../contexts/bountiesContext";

import appConfig from "../configs/app";
import Head from "next/head";
import { useEffect } from "react";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{appConfig.appName}</title>
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BountiesProvider>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </BountiesProvider>
      </Web3ReactProvider>
    </>
  );
}

export default MyApp;
