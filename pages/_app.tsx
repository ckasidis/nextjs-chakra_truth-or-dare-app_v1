import type { AppProps } from 'next/app';
import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { theme } from '@chakra-ui/pro-theme';
import GameContextProvider from '../context/GameContext';

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
			<GameContextProvider>
				<Component {...pageProps} />
			</GameContextProvider>
		</ChakraProvider>
	);
}

export default MyApp;
