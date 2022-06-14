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

	const validCategories = categories.filter(
		(category) => category.selected
	).length;
	const validPlayers = playerList.length;

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
					isFitted
				>
					<TabList>
						<Tab>Categories</Tab>
						<Tab isDisabled={!validCategories}>Players</Tab>
						<Tab isDisabled={!validCategories || !validPlayers}>Rounds</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Stack spacing={6} my={2}>
								<SimpleGrid
									columns={2}
									spacing={2}
									alignContent={'start'}
									maxH={64}
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
								<Button
									onClick={() => setTabIndex(1)}
									isDisabled={!validCategories}
									colorScheme={'brand'}
									variant={'solid'}
								>
									Next
								</Button>
							</Stack>
						</TabPanel>
						<TabPanel>
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
										<Stack spacing={6} my={2}>
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
											{playerList.length && (
												<SimpleGrid
													columns={2}
													spacing={2}
													alignContent={'start'}
													maxH={64}
													overflowY={'scroll'}
												>
													{playerList.map((player) => (
														<Center
															key={player}
															bg={'gray.100'}
															p={2}
															rounded={'lg'}
														>
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
											)}
											<Button
												onClick={() => setTabIndex(2)}
												isDisabled={!validPlayers}
												colorScheme={'brand'}
												variant={'solid'}
											>
												Next
											</Button>
										</Stack>
									</Form>
								)}
							</Formik>
						</TabPanel>
						<TabPanel>
							<Formik
								initialValues={{
									noOfRounds: 0,
								}}
								validationSchema={Yup.object({
									noOfRounds: Yup.number()
										.required('This field is required!')
										.min(1, 'Cannot have less than 1 rounds')
										.max(100, 'Cannot have more than 100 rounds'),
								})}
								validateOnMount
								onSubmit={(values) => {
									setGameSettings({
										newTruthOrDareList: getTruthOrDareList(
											availableTruthOrDareList,
											categories
												.filter((category) => category.selected)
												.map((category) => category.name)
										),
										newPlayerList: playerList,
										newNoOfRounds: noOfRounds,
									});
									router.push('/game');
								}}
							>
								{({
									values,
									errors,
									touched,
									isValid,
									handleChange,
									handleBlur,
								}) => (
									<Form>
										<Stack spacing={6} my={2}>
											<FormControl
												isInvalid={!!errors.noOfRounds && touched.noOfRounds}
											>
												<Stack isInline>
													<Input
														type="number"
														id="noOfRounds"
														placeholder="Enter number of rounds..."
														onChange={handleChange}
														onBlur={handleBlur}
														value={values.noOfRounds}
													/>
												</Stack>
												<FormErrorMessage>{errors.noOfRounds}</FormErrorMessage>
											</FormControl>
											<Button
												type="submit"
												isDisabled={!isValid}
												colorScheme={'brand'}
												variant={'solid'}
											>
												Start Game
											</Button>
										</Stack>
									</Form>
								)}
							</Formik>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Stack>
		</Center>
	);
};

export default NewGamePage;
