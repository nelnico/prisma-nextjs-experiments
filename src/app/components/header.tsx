"use client";
import {
  searchInProgressAtom,
  serviceProviderSearchAtom,
} from "@/atoms/service-provider-atom";
import { Spinner } from "@nextui-org/react";
import { useAtom } from "jotai";

export default function SiteHeader() {
  const searchParams = useAtom(serviceProviderSearchAtom);
  const [loadingState] = useAtom(searchInProgressAtom);
  return (
    <div className="border-b p-4 flex justify-between">
      <div>Site Name</div>
      <div className="text-xs flex items-center">
        {loadingState && <Spinner size="sm" className="me-4" />}{" "}
        {JSON.stringify(searchParams)}
      </div>
    </div>
  );
}
