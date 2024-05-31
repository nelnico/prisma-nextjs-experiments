import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('query');

  let whereCondition: Prisma.ServiceProviderWhereInput = {};

  if (query) {
    whereCondition = {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          phones: {
            some: {
              phone: {
                contains: query,
              },
            },
          },
        },
      ],
    };
  }

  const data = await prisma.serviceProvider.findMany({
    //skip: skip,
    // take: searchParams.size,
    where: whereCondition,
    include: {
      phones: true,
    },
  });

  return NextResponse.json(data);
}
