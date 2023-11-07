import UiLayoutWrapper from './lib/UiLayoutWrapper';
import WagmiWrapper from './lib/WagmiWrapper';

import './globals.css';


export default function RootLayout({ children }) {

  return (<html>
    <head>
      <link rel="favicon" href="/favicon.ico" sizes="any" />
      {/* <link rel="icon" href="/favicons/icon.ico" type="image/svg+xml" /> */}
      {/* <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" /> */}
      {/* <link rel="manifest" href="/favicons/manifest.json" /> */}

      <title>Blockreach | Identity-verified Web3 profile index</title>
      <meta name="description" content="Privy Auth Starter" />
    </head>
    <body>
      <WagmiWrapper>
        <UiLayoutWrapper>
          {children}
        </UiLayoutWrapper>
      </WagmiWrapper>
    </body>
  </html>
  )

}