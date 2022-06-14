import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Center, Heading, Stack } from '@chakra-ui/react';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = ({}) => {
	const router = useRouter();
	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			<Stack spacing={4} w={'75%'}>
				<Heading as={'h1'} size={'md'} textAlign={'center'}>
					Truth or Dare
				</Heading>
				<Stack spacing={3}>
					<Button
						onClick={() => router.push('/new-game')}
						colorScheme={'brand'}
						variant={'solid'}
					>
						New Game
					</Button>
					<Button>Resume</Button>
				</Stack>
			</Stack>
		</Center>
	);
};

export default HomePage;
