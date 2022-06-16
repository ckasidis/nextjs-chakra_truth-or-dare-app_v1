import { NextPage } from 'next';
import { createContext, useEffect, useState } from 'react';
import { supportsLocalStorage } from '../utilities/localStorage';

interface IGameContext {
	localStorageLoaded: boolean;
	gameSettings: GameSettings | null;
	setGameSettings: (gameSettings: GameSettings) => void;
	gameStatus: GameStatus | null;
	roll: () => void;
	reroll: () => void;
	endgame: () => void;
}

export const GameContext = createContext<IGameContext>({
	localStorageLoaded: false,
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

export const GameContextProvider: NextPage<GameContextProviderProps> = ({
	children,
}) => {
	const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
	const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
	const [localStorageLoaded, setLocalStorageLoaded] = useState(false);

	useEffect(() => {
		setGameSettings(
			supportsLocalStorage() && localStorage.getItem('gameSettings')
				? JSON.parse(localStorage.getItem('gameSettings')!)
				: null
		);
		setGameStatus(
			supportsLocalStorage() && localStorage.getItem('gameStatus')
				? JSON.parse(localStorage.getItem('gameStatus')!)
				: null
		);
		setLocalStorageLoaded(true);
	}, []);

	useEffect(() => {
		if (supportsLocalStorage())
			localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
	}, [gameSettings]);

	useEffect(() => {
		if (supportsLocalStorage()) {
			localStorage.setItem('gameStatus', JSON.stringify(gameStatus));
		}
	}, [gameStatus]);

	return (
		<GameContext.Provider
			value={{
				localStorageLoaded,
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
