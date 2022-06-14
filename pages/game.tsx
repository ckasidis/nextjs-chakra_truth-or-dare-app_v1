import { Button, Center, Stack, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

interface GamePageProps {}

const GamePage: NextPage<GamePageProps> = ({}) => {
	const router = useRouter();

	const { gameSettings, gameStatus, roll, reroll } = useContext(GameContext);

	useEffect(() => {
		if (gameSettings === null) router.push('/');
		else if (gameStatus === null) roll();
	}, []);

	return (
		<Center>
			{gameStatus ? (
				<Stack spacing={6}>
					<Text>{gameStatus.curTruthOrDare.fields.description}</Text>
					<Text>{gameStatus.curPlayer}</Text>
					<Text>{gameStatus.curRound}</Text>
					<Button onClick={roll}>Roll</Button>
					<Button onClick={reroll}>Reroll</Button>
				</Stack>
			) : (
				<Text>Loading...</Text>
			)}
		</Center>
	);
};

export default GamePage;
