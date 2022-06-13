import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import {
	Button,
	Center,
	CloseButton,
	FormControl,
	FormErrorMessage,
	Heading,
	Input,
	SimpleGrid,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { GameContext } from '../context/GameContext';

const categoryNames = ['General', 'Love', 'Opinion'];

export const getStaticProps: GetStaticProps = async () => {
	const { records } = await (
		await fetch(`${process.env.AIRTABLE_BASE_URL}`, {
			headers: {
				Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
			},
		})
	).json();

	console.log(records);

	return {
		props: {
			availableTruthOrDareList: records,
		},
	};
};

interface NewGamePageProps {
	availableTruthOrDareList: TruthOrDare[];
}

const NewGamePage: NextPage<NewGamePageProps> = ({
	availableTruthOrDareList,
}) => {
	const router = useRouter();

	const [tabIndex, setTabIndex] = useState<0 | 1 | 2>(0);
	const [categories, setCategories] = useState<Category[]>(
		categoryNames.map((name) => ({ name, selected: false }))
	);
	const [playerList, setPlayerList] = useState<string[]>([]);
	const [noOfRounds, setNoOfRounds] = useState(0);

	const { setGameSettings } = useContext(GameContext);

	const getTruthOrDareList = (
		availableTruthOrDareList: TruthOrDare[],
		selectedCategories: string[]
	): TruthOrDare[] => {
		let newTruthOrDareList: TruthOrDare[] = [];
		for (const category of selectedCategories) {
			newTruthOrDareList = [
				...newTruthOrDareList,
				...availableTruthOrDareList.filter(
					(cur) => cur.fields.category === category
				),
			];
		}
		return newTruthOrDareList;
	};

	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			<Stack w={'90%'}>
				<Heading as={'h1'} size={{ base: 'sm' }} textAlign={'center'}>
					Game Settings
				</Heading>
				<Tabs
					index={tabIndex}
					onChange={(index) => {
						if (index !== 0 && index !== 1 && index !== 2) return;
						setTabIndex(index);
					}}
					pt={4}
					pb={8}
					isFitted
				>
					<TabList>
						<Tab>Categories</Tab>
						<Tab>Players</Tab>
						<Tab>Rounds</Tab>
					</TabList>
					<TabPanels h={{ base: 270 }}>
						<TabPanel>
							<SimpleGrid
								columns={2}
								spacing={2}
								alignContent={'start'}
								h={{ base: 220 }}
								my={4}
								overflowY={'scroll'}
							>
								{categories.map((category) => (
									<Button
										key={category.name}
										onClick={() => {
											setCategories(
												categories.map((cur) =>
													cur.name === category.name
														? {
																...cur,
																selected: !cur.selected,
														  }
														: cur
												)
											);
										}}
										colorScheme={category.selected ? 'pink' : 'gray'}
										variant={'solid'}
									>
										{category.name}
									</Button>
								))}
							</SimpleGrid>
						</TabPanel>
						<TabPanel>
							<Stack spacing={6} my={4}>
								<Formik
									initialValues={{
										playerName: '',
									}}
									validationSchema={Yup.object({
										playerName: Yup.string()
											.required('Player cannot have a blank name')
											.test(
												'test-duplicate-names',
												'Cannot have players with duplicate names',
												function (value) {
													return !playerList.includes(value!);
												}
											),
									})}
									onSubmit={(values, actions) => {
										actions.resetForm();
										setPlayerList([...playerList, values.playerName]);
									}}
								>
									{({ values, errors, isValid, handleChange }) => (
										<Form>
											<FormControl isInvalid={!!errors.playerName}>
												<Stack isInline>
													<Input
														type="text"
														id="playerName"
														placeholder="Enter a new player..."
														onChange={handleChange}
														value={values.playerName}
													/>
													<Button
														type="submit"
														disabled={!isValid}
														colorScheme={'brand'}
														variant={'solid'}
													>
														Add
													</Button>
												</Stack>
												<FormErrorMessage>{errors.playerName}</FormErrorMessage>
											</FormControl>
										</Form>
									)}
								</Formik>
								<SimpleGrid
									columns={2}
									spacing={2}
									alignContent={'start'}
									h={{ base: 150 }}
									overflowY={'scroll'}
								>
									{playerList.map((player) => (
										<Center key={player} bg={'gray.100'} p={2} rounded={'lg'}>
											<Text
												fontSize={'lg'}
												fontWeight={'medium'}
												textAlign={'center'}
												flex={1}
											>
												{player}
											</Text>
											<CloseButton
												onClick={() => {
													setPlayerList(
														playerList.filter((cur) => cur !== player)
													);
												}}
												size={'sm'}
												color={'red.500'}
											/>
										</Center>
									))}
								</SimpleGrid>
							</Stack>
						</TabPanel>
						<TabPanel>
							<Stack spacing={8} my={4}>
								<Formik
									initialValues={{
										noOfRounds: 0,
									}}
									validationSchema={Yup.object({
										noOfRounds: Yup.number()
											.min(1, 'Cannot have less than 1 rounds')
											.max(100, 'Cannot have more than 100 rounds'),
									})}
									onSubmit={(values, actions) => {
										setNoOfRounds(values.noOfRounds);
										actions.resetForm();
									}}
								>
									{({ values, errors, isValid, handleChange }) => (
										<Form>
											<FormControl isInvalid={!!errors.noOfRounds}>
												<Stack isInline>
													<Input
														type="number"
														id="noOfRounds"
														placeholder="Enter number of rounds..."
														onChange={handleChange}
														value={values.noOfRounds}
													/>
													<Button
														type="submit"
														isDisabled={!isValid}
														colorScheme={'brand'}
														variant={'solid'}
													>
														Save
													</Button>
												</Stack>
												<FormErrorMessage>{errors.noOfRounds}</FormErrorMessage>
											</FormControl>
										</Form>
									)}
								</Formik>
								<Stack>
									<Heading as={'h3'} size={'xs'} textAlign={'center'}>
										Number of Rounds: {noOfRounds}
									</Heading>
								</Stack>
							</Stack>
						</TabPanel>
					</TabPanels>
				</Tabs>
				<Button
					onClick={() => {
						switch (tabIndex) {
							case 0:
								setTabIndex(1);
								break;
							case 1:
								setTabIndex(2);
								break;
							case 2:
								// set game settings
								const selectedCategories = categories
									.filter((category) => category.selected)
									.map((category) => category.name);
								const newGameSettings: GameSettings = {
									newPlayerList: playerList,
									newNoOfRounds: noOfRounds,
									newTruthOrDareList: getTruthOrDareList(
										availableTruthOrDareList,
										selectedCategories
									),
								};
								setGameSettings(newGameSettings);
								// navigate to game page
								router.push('/game');
								break;
							default:
								break;
						}
					}}
					colorScheme={'brand'}
					variant={'solid'}
				>
					{tabIndex === 2 ? 'Start Game' : 'Next'}
				</Button>
			</Stack>
		</Center>
	);
};

export default NewGamePage;
