import type { AppProps } from 'next/app';
import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { theme } from '@chakra-ui/pro-theme';

const myTheme = extendTheme(
	{
		colors: { ...theme.colors, brand: theme.colors.red },
	},
	theme
);

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={myTheme}>
			<CSSReset />
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;
