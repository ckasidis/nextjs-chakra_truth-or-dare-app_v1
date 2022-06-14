import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Button, Center, Heading, Stack } from '@chakra-ui/react';
import { GameContext } from '../context/GameContext';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = ({}) => {
	const router = useRouter();

	const { gameSettings, gameStatus } = useContext(GameContext);
	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			<Stack spacing={4} w={'75%'}>
				<Heading as={'h1'} size={'md'} textAlign={'center'}>
					Truth or Dare
				</Heading>
				<Stack spacing={3}>
					<Button
						onClick={() => router.push('/new-game')}
						colorScheme={'brand'}
						variant={'solid'}
					>
						New Game
					</Button>
					{gameSettings && gameStatus && (
						<Button onClick={() => router.push('/game')}>Resume</Button>
					)}
				</Stack>
			</Stack>
		</Center>
	);
};

export default HomePage;
