import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import { ChakraProvider } from '@chakra-ui/react'
import { SWRConfig } from "swr";
import fetchJson from "@/src/fetchJson";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}
