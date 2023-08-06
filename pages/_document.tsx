import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Play a word guessing game" />
          <meta property="og:site_name" content="nextjsconf-pics.vercel.app" />
          <meta property="og:description" content="Play a word guessing game" />
          <meta
            property="og:title"
            content="Wordage, an AI word guessing game"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Wordage, an AI word guessing game"
          />
          <meta
            name="twitter:description"
            content="Play a word guessing game"
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
