import App from "next/app";
import Head from "next/head";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Cookies from "js-cookie";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  fetcOptions: {
    credentials: "include"
  }
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const config = {
      // apiKey: API_KEY // TODO determine how to get this resolved
      apiKey: "4fe42b35e76b863d1b1d6698c7b7b29c",
      shopOrigin: Cookies.get("shopOrigin"),
      forceRedirect: true
    };

    return (
      <>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
        </Head>

        <Provider config={config}>
          <AppProvider i18n={translations}>
            <ApolloProvider client={client}>
              <Component {...pageProps} />
            </ApolloProvider>
          </AppProvider>
        </Provider>
      </>
    );
  }
}

export default MyApp;
