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
	newTruthOrDareList: TruthOrDare[];
	newPlayerList: string[];
	newNoOfRounds: number;
}
