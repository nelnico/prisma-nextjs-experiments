import { ServiceProviderSearchFormData } from "@/schemas/service-provider-search-schema";
import { atom } from "jotai";

import { atomWithStorage } from "jotai/utils";

export const serviceProviderSearchAtom =
  atomWithStorage<ServiceProviderSearchFormData>(
    "service-provider-search",
    {
      page: 0,
      size: 20,
      query: "",
      genderId: 0,
      provinceIds: [],
      ageRange: [21, 80],
      isMarried: true,
      hasChildren: true,
    },
    undefined,
    { getOnInit: true }
  );

export const appliedServiceProvidersSearchAtom = atom((get) =>
  get(serviceProviderSearchAtom)
);
