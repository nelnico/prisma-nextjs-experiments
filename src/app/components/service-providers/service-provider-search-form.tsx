"use client";
import { useDebounce } from "@/app/hooks/use-debounce";
import { serviceProviderSearchAtom } from "@/atoms/service-provider-atom";
import {
  dbGenders,
  dbProvinces,
  getDbItemsForSelectList,
} from "@/lib/constants";
import {
  ServiceProviderSearchFormData,
  serviceProviderSearchSchema,
} from "@/schemas/service-provider-search-schema";
import { de } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import { Button, Select, SelectItem, Slider } from "@nextui-org/react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export default function PeopleSearchForm() {
  const setSearchParams = useSetAtom(serviceProviderSearchAtom);

  const defaultValues: ServiceProviderSearchFormData = {
    page: 0,
    size: 20,
    query: "",
    genderId: 0,
    provinceIds: [],
    ageRange: [21, 80],
  };

  const form = useForm<ServiceProviderSearchFormData>({
    resolver: zodResolver(serviceProviderSearchSchema),
    defaultValues,
  });

  const { register } = form;

  const formWatch = useWatch(form);
  const debounceFormWatch = useDebounce(formWatch, 300);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      ...debounceFormWatch,
    }));
  }, [debounceFormWatch, setSearchParams]);

  const handleReset = () => {
    form.reset();
  };

  return (
    <form className="flex flex-col gap-2 border p-2 rounded-md">
      <Input
        {...register("query")}
        label="Search by name or phone"
        placeholder="Search..."
      />

      <Select
        {...register("genderId")}
        label="Gender"
        placeholder="Select a gender"
        onChange={(e) => form.setValue("genderId", Number(e.target.value))}
      >
        {getDbItemsForSelectList(dbGenders).map((gender) => (
          <SelectItem key={gender.value} value={gender.value}>
            {gender.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        {...register("provinceIds")}
        label="Provinces"
        selectionMode="multiple"
        placeholder="Select provinces"
        defaultSelectedKeys={form.getValues("provinceIds")?.map(String)}
        onChange={(e) => {
          const value = e.target.value
            .split(",")
            .map((id) => Number(id))
            .filter((id) => id > 0);
          form.setValue("provinceIds", value);
        }}
      >
        {getDbItemsForSelectList(dbProvinces).map((province) => (
          <SelectItem key={province.value} value={province.value}>
            {province.label}
          </SelectItem>
        ))}
      </Select>

      <Slider
        size="sm"
        label="Select an age range"
        step={2}
        maxValue={80}
        minValue={21}
        value={form.getValues("ageRange")}
        onChange={(value) => {
          if (
            Array.isArray(value) &&
            value.every((v) => typeof v === "number")
          ) {
            form.setValue("ageRange", value);
          }
        }}
        className="max-w-md"
      />
      <div className="flex justify-end">
        <Button type="button" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
