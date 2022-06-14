import { NextPage } from 'next';
import { createContext, useState } from 'react';

interface IGameContext {
	gameSettings: GameSettings | null;
	setGameSettings: (gameSettings: GameSettings) => void;
	gameStatus: GameStatus | null;
	roll: () => void;
	reroll: () => void;
	endgame: () => void;
}

export const GameContext = createContext<IGameContext>({
	gameSettings: null,
	setGameSettings: () => {},
	gameStatus: null,
	roll: () => {},
	reroll: () => {},
	endgame: () => {},
});

interface GameContextProviderProps {
	children: React.ReactNode;
}

const GameContextProvider: NextPage<GameContextProviderProps> = ({
	children,
}) => {
	const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
	const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);

	return (
		<GameContext.Provider
			value={{
				gameSettings,
				setGameSettings: (gameSettings) => {
					setGameSettings(gameSettings);
				},
				gameStatus,
				roll: () => {
					const { playerList, truthOrDareList } = gameSettings!;
					const randomTruthOrDare =
						truthOrDareList[Math.floor(Math.random() * truthOrDareList.length)];
					const randomPlayer =
						playerList[Math.floor(Math.random() * playerList.length)];
					setGameStatus(
						gameStatus === null
							? {
									curTruthOrDare: randomTruthOrDare,
									curPlayer: randomPlayer,
									curRound: 1,
							  }
							: {
									curTruthOrDare: randomTruthOrDare,
									curPlayer: randomPlayer,
									curRound: gameStatus.curRound + 1,
							  }
					);
				},
				reroll: () => {
					const { truthOrDareList } = gameSettings!;
					const randomTruthOrDare =
						truthOrDareList[Math.floor(Math.random() * truthOrDareList.length)];
					setGameStatus({
						...gameStatus!,
						curTruthOrDare: randomTruthOrDare,
					});
				},
				endgame: () => {
					setGameSettings(null);
					setGameStatus(null);
				},
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
