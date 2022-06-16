import {
	Badge,
	Button,
	Center,
	Flex,
	Heading,
	Stack,
	Text,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

interface GamePageProps {}

const GamePage: NextPage<GamePageProps> = ({}) => {
	const router = useRouter();

	const { gameSettings, gameStatus, roll, reroll, endgame } =
		useContext(GameContext);

	useEffect(() => {
		if (gameSettings === null) router.push('/');
		else if (gameStatus === null) roll();
	}, []);

	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			{gameSettings && gameStatus ? (
				<Stack spacing={8} w={'80%'}>
					<Stack>
						<Heading size={'md'} fontWeight={'bold'} textAlign={'center'}>
							Round {gameStatus.curRound}/{gameSettings.noOfRounds}
						</Heading>
						<Heading size={'xs'} fontWeight={'bold'} textAlign={'center'}>
							{gameStatus.curPlayer}
						</Heading>
					</Stack>
					<Stack>
						<Flex gap={1}>
							<Badge colorScheme={'blue'}>
								{gameStatus.curTruthOrDare.fields.type}
							</Badge>
							<Badge colorScheme={'blue'}>
								{gameStatus.curTruthOrDare.fields.category}
							</Badge>
						</Flex>
						<Text>{gameStatus.curTruthOrDare.fields.description}</Text>
					</Stack>
					<Stack spacing={3}>
						{gameStatus.curRound >= gameSettings.noOfRounds ? (
							<Button
								onClick={() => {
									endgame();
									router.push('/');
								}}
								colorScheme={'brand'}
								variant={'solid'}
							>
								End Game
							</Button>
						) : (
							<Button onClick={roll} colorScheme={'brand'} variant={'solid'}>
								Roll
							</Button>
						)}
						<Button onClick={reroll}>Reroll</Button>
					</Stack>
					<Button
						onClick={() => router.push('/')}
						colorScheme={'blue'}
						variant={'link'}
					>
						Quit Game
					</Button>
				</Stack>
			) : (
				<Text>Loading...</Text>
			)}
		</Center>
	);
};

export default GamePage;
