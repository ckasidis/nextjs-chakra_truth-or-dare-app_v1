import { NextPage } from 'next';
import { useState } from 'react';
import {
	Box,
	Button,
	Center,
	CloseButton,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	Heading,
	Input,
	SimpleGrid,
	Stack,
	StackDivider,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { setValues } from 'framer-motion/types/render/utils/setters';

const categoryNames = [
	'cat1',
	'cat2',
	'cat3',
	'cat4',
	'cat5',
	'cat6',
	'cat7',
	'cat8',
	'cat9',
	'cat10',
];

interface NewGamePageProps {}

const NewGamePage: NextPage<NewGamePageProps> = ({}) => {
	interface Category {
		name: string;
		selected: boolean;
	}

	const [categories, setCategories] = useState<Category[]>(
		categoryNames.map((name) => ({ name, selected: false }))
	);
	const [playerList, setPlayerList] = useState<string[]>([]);
	const [noOfRounds, setNoOfRounds] = useState(0);

	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			<Stack w={'90%'}>
				<Heading as={'h1'} size={{ base: 'sm' }} textAlign={'center'}>
					Game Settings
				</Heading>
				<Tabs pt={4} pb={8}>
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
				<Button onClick={() => {}} colorScheme={'brand'} variant={'solid'}>
					Next
				</Button>
			</Stack>
		</Center>
	);
};

export default NewGamePage;
