import { dbGenders, dbProvinces, getDbValueById } from "@/lib/constants";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { ServiceProvider } from "@prisma/client";

interface ServiceProviderSearchResultProps {
  data: ServiceProvider[];
}
export default function ServiceProvidersTable({
  data,
}: ServiceProviderSearchResultProps) {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>YEAR OF BIRTH</TableColumn>
        <TableColumn>GENDER</TableColumn>
        <TableColumn>LOCATION</TableColumn>
        <TableColumn>MARRIED</TableColumn>
        <TableColumn>HAS CHILDREN</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((serviceProvider) => (
          <TableRow key={serviceProvider.id}>
            <TableCell>{serviceProvider.name}</TableCell>
            <TableCell>{serviceProvider.yearOfBirth}</TableCell>
            <TableCell>
              {" "}
              {(() => {
                const value = getDbValueById(
                  dbGenders,
                  serviceProvider.genderId
                );
                return value?.description ? value.description : value?.name;
              })()}
            </TableCell>
            <TableCell>
              {(() => {
                const value = getDbValueById(
                  dbProvinces,
                  serviceProvider.provinceId
                );
                return value?.description ? value.description : value?.name;
              })()}
            </TableCell>
            <TableCell>
              {serviceProvider.isMarried === true
                ? "Yes"
                : serviceProvider.isMarried === false
                ? "No"
                : "-"}
            </TableCell>
            <TableCell>
              {serviceProvider.hasChildren === true
                ? "Yes"
                : serviceProvider.hasChildren === false
                ? "No"
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
