import {
	Badge,
	Button,
	Center,
	CloseButton,
	Flex,
	FormControl,
	FormErrorMessage,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	SimpleGrid,
	Stack,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { FaEdit, FaUser } from 'react-icons/fa';
import { GameContext } from '../context/GameContext';
import { supportsLocalStorage } from '../utilities/localStorage';

interface GamePageProps {}

const GamePage: NextPage<GamePageProps> = ({}) => {
	const router = useRouter();

	const {
		localStorageLoaded,
		gameSettings,
		setGameSettings,
		gameStatus,
		roll,
		rerollTruthOrDare,
		rerollPlayer,
		endgame,
	} = useContext(GameContext);

	useEffect(() => {
		if (gameSettings && gameStatus === null) roll();
		else if (!supportsLocalStorage() || !localStorage.getItem('gameSettings'))
			router.push('/');
	}, []);

	useEffect(() => {
		if (!localStorageLoaded) return;
		else if (gameSettings === null) router.push('/');
		else if (gameStatus === null) roll();
	}, [localStorageLoaded]);

	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			{gameSettings && gameStatus ? (
				<Stack spacing={8} w={'80%'}>
					<Stack alignItems={'center'}>
						<Heading size={'md'} fontWeight={'bold'} textAlign={'center'}>
							Round {gameStatus.curRound}/{gameSettings.noOfRounds}
						</Heading>
						<Flex
							alignItems={'center'}
							gap={2}
							fontSize={{ base: 'lg', sm: 'xl' }}
						>
							<FaUser />
							<Text as={'strong'}>{gameStatus.curPlayer}</Text>
						</Flex>
						<Button
							onClick={onOpen}
							leftIcon={<FaEdit />}
							size={'sm'}
							colorScheme={'blue'}
							fontSize={'sm'}
						>
							Edit
						</Button>
					</Stack>
					<Stack>
						<Flex gap={1}>
							<Badge colorScheme={'blue'}>
								{gameStatus.curTruthOrDare.fields.type}
							</Badge>
							<Badge colorScheme={'blue'}>
								{gameStatus.curTruthOrDare.fields.category}
							</Badge>
						</Flex>
						<Text>{gameStatus.curTruthOrDare.fields.description}</Text>
					</Stack>
					<Stack spacing={3}>
						{gameStatus.curRound >= gameSettings.noOfRounds ? (
							<Button
								onClick={() => {
									endgame();
									router.push('/');
								}}
								colorScheme={'brand'}
								variant={'solid'}
							>
								End Game
							</Button>
						) : (
							<Button onClick={roll} colorScheme={'brand'} variant={'solid'}>
								Next
							</Button>
						)}
						<Flex gap={2}>
							<Button
								onClick={rerollTruthOrDare}
								flex={1}
								fontSize={{ base: 'small', sm: 'medium' }}
							>
								Reroll Truth or Dare
							</Button>
							<Button
								onClick={rerollPlayer}
								flex={1}
								fontSize={{ base: 'sm', sm: 'md' }}
							>
								Reroll Player
							</Button>
						</Flex>
					</Stack>
					<Button
						onClick={() => router.push('/')}
						colorScheme={'blue'}
						variant={'link'}
					>
						Quit Game
					</Button>
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Edit Players</ModalHeader>
							<ModalCloseButton />
							<ModalBody pb={8}>
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
													return !gameSettings.playerList.includes(value!);
												}
											),
									})}
									onSubmit={(values, actions) => {
										actions.resetForm();
										setGameSettings({
											...gameSettings,
											playerList: [
												...gameSettings.playerList,
												values.playerName,
											],
										});
									}}
								>
									{({ values, errors, isValid, handleChange }) => (
										<Form>
											<Stack spacing={6} my={2}>
												<Flex gap={2}>
													<FormControl isInvalid={!!errors.playerName}>
														<Input
															type="text"
															id="playerName"
															placeholder="Enter a new player..."
															onChange={handleChange}
															value={values.playerName}
														/>
														<FormErrorMessage>
															{errors.playerName}
														</FormErrorMessage>
													</FormControl>
													<Button
														type="submit"
														disabled={!isValid}
														colorScheme={'brand'}
														variant={'solid'}
													>
														Add
													</Button>
												</Flex>
												{gameSettings.playerList.length && (
													<SimpleGrid
														columns={2}
														spacing={2}
														alignContent={'start'}
														maxH={64}
														overflowY={'scroll'}
													>
														{gameSettings.playerList.map((player) => (
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
																		setGameSettings({
																			...gameSettings,
																			playerList:
																				gameSettings.playerList.filter(
																					(cur) => cur !== player
																				),
																		});
																	}}
																	size={'sm'}
																	color={'red.500'}
																/>
															</Center>
														))}
													</SimpleGrid>
												)}
											</Stack>
										</Form>
									)}
								</Formik>
							</ModalBody>
						</ModalContent>
					</Modal>
				</Stack>
			) : (
				<Text>Loading...</Text>
			)}
		</Center>
	);
};

export default GamePage;
