import { NextPage } from 'next';
import { useState } from 'react';
import {
	Button,
	Center,
	Heading,
	SimpleGrid,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';

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

	return (
		<Center as={'section'} maxW={'lg'} h={'100vh'} mx={'auto'}>
			<Stack spacing={4}>
				<Heading as={'h1'} size={{ base: 'sm' }} textAlign={'center'}>
					Game Settings
				</Heading>
				<Tabs>
					<TabList>
						<Tab>Categories</Tab>
						<Tab>Players</Tab>
						<Tab>Rounds</Tab>
					</TabList>
					<TabPanels>
						<TabPanel h={{ base: 200 }} my={4} overflowY={'scroll'}>
							<SimpleGrid alignContent={'start'} columns={2} spacing={2}>
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
