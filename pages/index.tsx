import { NextPage } from 'next';
import { Button, Center, Heading, Stack } from '@chakra-ui/react';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = ({}) => {
	return (
		<Center as="section" maxW="lg" h="100vh" mx="auto">
			<Stack spacing="4" w="75%">
				<Heading as="h1" size="md" textAlign="center">
					Truth or Dare
				</Heading>
				<Stack spacing="2">
					<Button colorScheme="brand" variant="solid">
						New Game
					</Button>
					<Button colorScheme="brand" variant="outline">
						Resume
					</Button>
				</Stack>
			</Stack>
		</Center>
	);
};

export default HomePage;
