import {
	Badge,
	Button,
	Center,
	Flex,
	Heading,
	Stack,
	Tag,
	TagLabel,
	Text,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { GameContext } from '../context/GameContext';
import { supportsLocalStorage } from '../utilities/localStorage';

interface GamePageProps {}

const GamePage: NextPage<GamePageProps> = ({}) => {
	const router = useRouter();

	const {
		localStorageLoaded,
		gameSettings,
		gameStatus,
		roll,
		rerollTruthOrDare,
		rerollPlayer,
		endgame,
	} = useContext(GameContext);

	useEffect(() => {
		if (gameSettings && gameStatus === null) roll();
		else if (!supportsLocalStorage() || !localStorage.getItem('gameSettings'))
			router.push('/');
	}, []);

	useEffect(() => {
		if (!localStorageLoaded) return;
		else if (gameSettings === null) router.push('/');
		else if (gameStatus === null) roll();
	}, [localStorageLoaded]);

	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			{gameSettings && gameStatus ? (
				<Stack spacing={8} w={'80%'}>
					<Stack alignItems={'center'}>
						<Heading size={'md'} fontWeight={'bold'} textAlign={'center'}>
							Round {gameStatus.curRound}/{gameSettings.noOfRounds}
						</Heading>
						<Flex
							alignItems={'center'}
							gap={2}
							fontSize={{ base: 'lg', sm: 'xl' }}
						>
							<FaUser />
							<Text as={'strong'}>{gameStatus.curPlayer}</Text>
						</Flex>
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
								Next
							</Button>
						)}
						<Flex gap={2}>
							<Button
								onClick={rerollTruthOrDare}
								flex={1}
								fontSize={{ base: 'small', sm: 'medium' }}
							>
								Reroll Truth or Dare
							</Button>
							<Button
								onClick={rerollPlayer}
								flex={1}
								fontSize={{ base: 'sm', sm: 'md' }}
							>
								Reroll Player
							</Button>
						</Flex>
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
