import { SessionProvider } from 'next-auth/react'
import { MantineProvider } from '@mantine/core';

function App({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <Component {...pageProps} />
            </MantineProvider>
        </SessionProvider>
    );
}
export default App;

