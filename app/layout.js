import UiLayoutWrapper from './lib/UiLayoutWrapper';
import { DidProvider } from './context/DidProvider';

import './globals.css';


export default function RootLayout({ children }) {

  return (<html>
    <head>
      <link rel="favicon" href="/favicon.ico" sizes="any" />
      {/* <link rel="icon" href="/favicons/icon.ico" type="image/svg+xml" /> */}
      {/* <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" /> */}
      {/* <link rel="manifest" href="/favicons/manifest.json" /> */}

      <title>VerifiedEntity | Identity-verified Web3 profile index</title>
      <meta name="description" content="Privy Auth Starter" />
    </head>
    <body>
      <DidProvider>
        <UiLayoutWrapper>
          {children}
        </UiLayoutWrapper>
</DidProvider>
    </body>
  </html>
  )

}
