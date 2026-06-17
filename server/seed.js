import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const defaultUsername = process.env.DEFAULT_USER || 'admin';
  const defaultPassword = process.env.DEFAULT_PASSWORD || 'password123';

  const existingUser = await prisma.user.findUnique({ where: { username: defaultUsername } });
  if (!existingUser) {
    const hashed = await bcrypt.hash(defaultPassword, 10);
    await prisma.user.create({ data: { username: defaultUsername, password: hashed } });
    console.log(`Created default user: ${defaultUsername}`);
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
    const existing = await prisma.house.findFirst({ where: { title: house.title } });
    if (!existing) {
      await prisma.house.create({ data: house });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
