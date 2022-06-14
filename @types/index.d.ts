interface TruthOrDare {
	id: string;
	createdTime: string;
	fields: {
		description: string;
		type: 'Truth' | 'Dare';
		category: string;
	};
}

interface Category {
	name: string;
	selected: boolean;
}

interface GameSettings {
	truthOrDareList: TruthOrDare[];
	playerList: string[];
	noOfRounds: number;
}

interface GameStatus {
	curTruthOrDare: TruthOrDare;
	curPlayer: string;
	curRound: number;
}
