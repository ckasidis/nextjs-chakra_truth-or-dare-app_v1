import { Stack, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

interface GamePageProps {}

const GamePage: NextPage<GamePageProps> = ({}) => {
	const { truthOrDareList, loadGame } = useContext(GameContext);

	useEffect(() => {
		loadGame();
	}, []);

	return (
		<Stack spacing={6}>
			{truthOrDareList.map((truthOrDare) => (
				<Stack key={truthOrDare.id} spacing={1}>
					<Text>{truthOrDare.fields.description}</Text>
					<Text>{truthOrDare.fields.category}</Text>
					<Text>{truthOrDare.fields.type}</Text>
				</Stack>
			))}
		</Stack>
	);
};

export default GamePage;
