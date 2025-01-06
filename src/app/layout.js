import { Nunito } from 'next/font/google'
import { CookiesProvider } from 'next-client-cookies/server';
import '@/app/global.css'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <CookiesProvider>
        <html lang="en" className={nunitoFont.className}>
            <head>
            <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
        </CookiesProvider>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
