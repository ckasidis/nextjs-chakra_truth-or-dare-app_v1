import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import {
	Button,
	Center,
	Flex,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useDisclosure,
} from '@chakra-ui/react';
import { GameContext } from '../context/GameContext';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = ({}) => {
	const router = useRouter();

	const { gameSettings, gameStatus } = useContext(GameContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			<Stack spacing={4} w={'75%'}>
				<Heading as={'h1'} size={'md'} textAlign={'center'}>
					Truth or Dare
				</Heading>
				<Stack spacing={3}>
					<Button
						onClick={
							gameSettings && gameStatus
								? onOpen
								: () => router.push('new-game')
						}
						colorScheme={'brand'}
						variant={'solid'}
					>
						New Game
					</Button>
					{gameSettings && gameStatus && (
						<Button onClick={() => router.push('/game')}>Resume</Button>
					)}
				</Stack>
			</Stack>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Warning</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						Current game&apos;s progress will not be saved if you start a new
						game. Would you like to resume?
					</ModalBody>
					<ModalFooter>
						<Flex gap={2}>
							<Button
								onClick={() => router.push('/game')}
								size={{ base: 'sm', sm: 'md' }}
								colorScheme="blue"
							>
								Resume Game
							</Button>
							<Button
								onClick={() => router.push('new-game')}
								size={{ base: 'sm', sm: 'md' }}
							>
								Start New Game
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Center>
	);
};

export default HomePage;
