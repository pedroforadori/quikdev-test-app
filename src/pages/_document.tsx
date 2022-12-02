import { Html, Head, Main, NextScript } from "next/document";

export default function Document () {
    return (
        <Html>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
            {/* <link rel="stylesheet" type="text/css" href="/nprogress.css" /> */}
        </Head>
        <body className="bg-slate-900">
            <Main />
            <NextScript />
        </body>
        </Html>
    )
    
}