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
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
} from "@nextui-org/react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export default function PeopleSearchForm() {
  const [searchParams, setSearchParams] = useAtom(serviceProviderSearchAtom);

  const defaultValues: ServiceProviderSearchFormData = {
    page: 0,
    size: 20,
    query: "",
    genderId: null,
    provinceIds: [],
    ageRange: [21, 80],
    isMarried: true,
    hasChildren: true,
  };

  const form = useForm<ServiceProviderSearchFormData>({
    resolver: zodResolver(serviceProviderSearchSchema),
    defaultValues,
  });

  const { register, reset } = form;

  const formWatch = useWatch(form);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      ...formWatch,
    }));
  }, [formWatch, setSearchParams]);

  const getBothYesNoValue = (value: boolean | null) => {
    if (value === null) return "both";
    if (value === true) return "yes";
    if (value === false) return "no";
    return "both"; // Default case, though it should not be reached
  };

  return (
    <form className="flex flex-col gap-2 border p-2 rounded-md">
      <Input
        {...register("query")}
        label="Search by name or phone"
        placeholder="Search..."
        value={form.getValues("query")}
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

      {/* <Checkbox {...register("isMarried")} color="primary">
        Married
      </Checkbox>

      <Checkbox {...register("hasChildren")} color="primary">
        Has Children
      </Checkbox> */}

      <RadioGroup
        label="Married"
        orientation="horizontal"
        onChange={(e) => {
          const value = e.target.value;
          if (value === "both") {
            form.setValue("isMarried", null);
          } else if (value === "yes") {
            form.setValue("isMarried", true);
          } else {
            form.setValue("isMarried", false);
          }
        }}
        value={getBothYesNoValue(form.getValues("isMarried"))}
      >
        <Radio value="both">Both</Radio>
        <Radio value="yes">Yes</Radio>
        <Radio value="no">No</Radio>
      </RadioGroup>

      <RadioGroup
        label="Has Children"
        orientation="horizontal"
        onChange={(e) => {
          const value = e.target.value;
          if (value === "both") {
            form.setValue("hasChildren", null);
          } else if (value === "yes") {
            form.setValue("hasChildren", true);
          } else {
            form.setValue("hasChildren", false);
          }
        }}
        value={getBothYesNoValue(form.getValues("hasChildren"))}
      >
        <Radio value="both">Both</Radio>
        <Radio value="yes">Yes</Radio>
        <Radio value="no">No</Radio>
      </RadioGroup>

      <div className="flex justify-end">
        <Button type="button" onClick={() => reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
}
