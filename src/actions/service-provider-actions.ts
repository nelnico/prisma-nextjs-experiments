"use server";

import prisma from "@/lib/db";
import { ServiceProviderSearchFormData } from "@/schemas/service-provider-search-schema";
import { Prisma, ServiceProvider } from "@prisma/client";

export type ServiceProviderSearchResult = {
  data: ServiceProvider[];
  totalCount: number;
  filteredCount: number;
};

export async function SearchServiceProviders(
  searchRequest: ServiceProviderSearchFormData
): Promise<ServiceProviderSearchResult | null> {
  try {
    let whereCondition: Prisma.ServiceProviderWhereInput = {};

    if (searchRequest.query) {
      whereCondition = {
        OR: [
          {
            name: {
              contains: searchRequest.query,
              mode: "insensitive",
            },
          },
          {
            phones: {
              some: {
                phone: {
                  contains: searchRequest.query,
                },
              },
            },
          },
        ],
      };
    }

    if (searchRequest.genderId && searchRequest.genderId > 0) {
      whereCondition = {
        ...whereCondition,
        genderId: searchRequest.genderId,
      };
    }

    if (searchRequest.provinceIds && searchRequest.provinceIds.length > 0) {
      whereCondition = {
        ...whereCondition,
        provinceId: {
          in: searchRequest.provinceIds,
        },
      };
    }

    if (searchRequest.ageRange) {
      whereCondition = {
        ...whereCondition,
        yearOfBirth: {
          gte: new Date().getFullYear() - searchRequest.ageRange[1],
          lte: new Date().getFullYear() - searchRequest.ageRange[0],
        },
      };
    }

    if (searchRequest.isMarried !== null) {
      whereCondition = {
        ...whereCondition,
        isMarried: searchRequest.isMarried,
      };
    }

    if (searchRequest.hasChildren !== null) {
      whereCondition = {
        ...whereCondition,
        hasChildren: searchRequest.hasChildren,
      };
    }

    const totalCount = await prisma.serviceProvider.count();
    const filteredCount = await prisma.serviceProvider.count({
      where: whereCondition,
    });

    const data = await prisma.serviceProvider.findMany({
      skip: searchRequest.page * searchRequest.size,
      take: searchRequest.size,
      where: whereCondition,
      include: {
        phones: true,
        listings: true,
      },
    });

    return {
      data,
      totalCount,
      filteredCount,
    };
  } catch (error) {
    console.error("Error fetching people:", error);
    return null;
  }
}
