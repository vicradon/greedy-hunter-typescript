import type { AppProps } from "next/app";
import AppProvider from "../src/context/main";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
