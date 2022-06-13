import { NextPage } from 'next';
import { createContext, useState } from 'react';

interface IGameContext {
	truthOrDareList: TruthOrDare[];
	playerList: string[];
	noOfRounds: number;
	setGameSettings: (newGameSettings: GameSettings) => void;
	loadGame: () => void;
	curTruthOrDare: TruthOrDare | null;
}

export const GameContext = createContext<IGameContext>({
	truthOrDareList: [],
	playerList: [],
	noOfRounds: 0,
	setGameSettings: () => {},
	loadGame: () => {},
	curTruthOrDare: null,
});

interface GameContextProviderProps {
	children: React.ReactNode;
}

const GameContextProvider: NextPage<GameContextProviderProps> = ({
	children,
}) => {
	const [truthOrDareList, setTruthOrDareList] = useState<TruthOrDare[]>([]);
	const [playerList, setPlayerList] = useState<string[]>([]);
	const [noOfRounds, setNoOfRounds] = useState(0);
	const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
	const [curTruthOrDare, setCurTruthOrDare] = useState<TruthOrDare | null>(
		null
	);

	return (
		<GameContext.Provider
			value={{
				truthOrDareList,
				playerList,
				noOfRounds,
				setGameSettings: (newGameSettings) => setGameSettings(newGameSettings),
				loadGame: () => {
					if (gameSettings === null) return;
					setTruthOrDareList(gameSettings.newTruthOrDareList);
					setPlayerList(gameSettings.newPlayerList);
					setNoOfRounds(gameSettings.newNoOfRounds);
					setGameSettings(null);
				},
				curTruthOrDare,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
