import { PrismaClient } from "@prisma/client";
import { fa, faker } from "@faker-js/faker";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSouthAfricanMobileNumber(): string {
  // South African mobile numbers typically start with +27 followed by 60, 61, 62, 63, 64, 65, 66, 67, 68, 69
  const countryCode = "0";
  const mobilePrefixes = [
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
  ];
  const randomPrefix =
    mobilePrefixes[Math.floor(Math.random() * mobilePrefixes.length)];
  const randomNumber = faker.random.numeric(7); // Generate 7 random digits

  return `${countryCode}${randomPrefix}${randomNumber}`;
}

const prisma = new PrismaClient();
async function main() {
  for (let i = 0; i < 1000000; i++) {
    try {
      await createRandomPerson();
    } catch (e) {
      console.error(e);
    }
  }
}
async function createRandomPerson() {
  const nullableBooleans = [true, false, null];
  const marriedIndex = Math.floor(Math.random() * nullableBooleans.length);
  const childrenIndex = Math.floor(Math.random() * nullableBooleans.length);

  const gender = faker.person.sexType();
  const genderId = gender === "female" ? 1 : 2;
  const name = faker.person.fullName({ sex: gender });
  const yearOfBirth = getRandomNumber(1950, 2010);

  const favColorCount = getRandomNumber(1, 3);
  const colors = [
    "red",
    "blue",
    "orange",
    "green",
    "yellow",
    "purple",
    "black",
    "white",
    "brown",
    "pink",
  ];

  let favColors: string[] = [];
  for (let i = 0; i < favColorCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (!favColors.includes(color)) favColors.push(color);
  }

  const provinceId = getRandomNumber(1, 9);
  return prisma.serviceProvider.create({
    data: {
      name,
      yearOfBirth,
      genderId,
      provinceId,
      favoriteColors: favColors,
      isMarried: nullableBooleans[marriedIndex],
      hasChildren: nullableBooleans[childrenIndex],
      phones: {
        create: [
          {
            phone: getRandomSouthAfricanMobileNumber(),
            isMain: true,
          },
          {
            phone: getRandomSouthAfricanMobileNumber(),
            isMain: false,
          },
        ],
      },
      listings: {
        create: [
          {
            name: "Site A",
            score: getRandomNumber(0, 100),
            url: faker.internet.url(),
          },
          {
            name: "Site B",
            score: getRandomNumber(0, 100),
            url: faker.internet.url(),
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
