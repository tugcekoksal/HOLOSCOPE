import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
       
        {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Caveat:wght@700&display=swap" rel="stylesheet"/> */}
          {/* Orbitron */}
         {/* <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        /> */}
             {/* bebas and audiowide */}
             <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Bebas+Neue&display=swap" rel="stylesheet"/>

 {/*  Exo 2 */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        /> */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
