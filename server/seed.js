import { createDefaultUser, getAllHouses, createHouse } from './data/store.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const defaultUsername = process.env.DEFAULT_USER || 'admin';
  const defaultPassword = process.env.DEFAULT_PASSWORD || 'password123';

  await createDefaultUser(defaultUsername, defaultPassword);

  const existingHouses = await getAllHouses();
  if (existingHouses.length > 0) {
    console.log('Houses already exist. Skipping seed.');
    return;
  }

  const houses = [
    {
      title: 'Modern apartment near downtown',
      link: 'https://example.com/listing/1',
      imagePath: '/placeholder.png',
      location: 'Barcelona, Spain',
      type: 'apartment',
      price: 450000,
      rooms: 3,
      bathrooms: 2,
      ibiPrice: 900,
      communityFee: 180,
      visited: true,
      description: 'Bright apartment with a balcony and great city views.',
    },
    {
      title: 'Charming villa with garden',
      link: 'https://example.com/listing/2',
      imagePath: '/placeholder.png',
      location: 'Mallorca, Spain',
      type: 'villa',
      price: 1250000,
      rooms: 5,
      bathrooms: 4,
      ibiPrice: 2100,
      communityFee: 350,
      visited: false,
      description: 'Luxurious villa with private pool and garden.',
    },
    {
      title: 'Cozy house in a quiet neighborhood',
      link: 'https://example.com/listing/3',
      imagePath: '/placeholder.png',
      location: 'Valencia, Spain',
      type: 'house',
      price: 360000,
      rooms: 4,
      bathrooms: 2,
      ibiPrice: 1100,
      communityFee: 150,
      visited: false,
      description: 'Comfortable home perfect for a family.',
    },
  ];

  for (const house of houses) {
    createHouse(house);
  }

  console.log('Seed complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

