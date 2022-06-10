import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '@chakra-ui/pro-theme';

const myTheme = extendTheme(
	{
		colors: { ...theme.colors, brand: theme.colors.orange },
	},
	theme
);

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={myTheme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;
