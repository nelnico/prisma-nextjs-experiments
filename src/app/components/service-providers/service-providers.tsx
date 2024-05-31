"use client";

import { useEffect, useState } from "react";
import PeopleSearchForm from "./service-provider-search-form";

import { SearchServiceProviders } from "@/actions/service-provider-actions";
import { useDebounce } from "@/app/hooks/use-debounce";
import {
  appliedServiceProvidersSearchAtom,
  searchInProgressAtom,
} from "@/atoms/service-provider-atom";
import { ServiceProvider } from "@prisma/client";
import { useAtom, useSetAtom } from "jotai";
import ServiceProvidersTable from "./service-provider-table";

export const ServiceProviders = () => {
  const [currentSearch] = useAtom(appliedServiceProvidersSearchAtom);
  const setIsSearching = useSetAtom(searchInProgressAtom);
  useEffect(() => {
    const loadServiceProviders = async () => {
      setIsSearching(true);
      try {
        const data = await SearchServiceProviders(currentSearch);

        setData(data?.data || []);
      } catch (err) {
        alert(err);
      } finally {
        setIsSearching(false);
      }
    };
    loadServiceProviders();
  }, [currentSearch, setIsSearching]);

  const [data, setData] = useState<ServiceProvider[]>([]);

  return (
    <div className="flex min-h-screen p-2">
      <div className="w-1/3   p-1">
        <PeopleSearchForm />
      </div>
      <div className="w-2/3  p-1">
        <ServiceProvidersTable data={data} />
      </div>
    </div>
  );
};
