import { NextPage } from 'next';
import { Center } from '@chakra-ui/react';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = ({}) => {
	return (
		<Center as="section" maxW="md" h="100vh" mx="auto">
			Home Page
		</Center>
	);
};

export default HomePage;
