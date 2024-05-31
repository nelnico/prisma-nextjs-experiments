"use client";

import { useEffect, useState } from "react";
import PeopleSearchForm from "./service-provider-search-form";

import { SearchServiceProviders } from "@/actions/service-provider-actions";
import { useDebounce } from "@/app/hooks/use-debounce";
import { appliedServiceProvidersSearchAtom } from "@/atoms/service-provider-atom";
import { ServiceProvider } from "@prisma/client";
import { useAtom } from "jotai";
import PeopleSearchResult from "./service-provider-search-result";

export const ServiceProviders = () => {
  const [currentSearch] = useAtom(appliedServiceProvidersSearchAtom);
  const debounceSearch = useDebounce(currentSearch, 300);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadServiceProviders = async () => {
      setLoading(true);
      try {
        const data = await SearchServiceProviders(debounceSearch);

        setData(data?.data || []);
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    };
    loadServiceProviders();
  }, [debounceSearch]);

  const [data, setData] = useState<ServiceProvider[]>([]);

  return (
    <div className="flex min-h-screen p-2">
      <div className="w-1/3   p-1">
        <PeopleSearchForm />
        {loading && <div className=" mt-2 italic p-1">Loading...</div>}
      </div>
      <div className="w-2/3  p-1">
        <PeopleSearchResult data={data} />
      </div>
    </div>
  );
};
