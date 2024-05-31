export type DatabaseConstantInfo = {
  name: string;
  priority: number;
  description: string;
};

export function getDbIdByValue<T>(
  obj: Record<number, DatabaseConstantInfo>,
  value: string | null | undefined
): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const lowerValue = value.toLowerCase();
  const entry = Object.entries(obj).find(
    ([_, info]) => info.name.toLowerCase() === lowerValue
  );
  return entry ? Number(entry[0]) : null;
}

export function getDbValueById(
  obj: Record<number, DatabaseConstantInfo>,
  id: number | null | undefined
): DatabaseConstantInfo | null {
  if (id === null || id === undefined) {
    return null;
  }
  return obj[id] || null;
}

export const getDbItemsForSelectList = <T extends DatabaseConstantInfo>(
  dbItems: Record<number, T>
): { value: string; label: string; description: string }[] => {
  const itemsList: { value: string; label: string; description: string }[] = [];
  for (const key in dbItems) {
    if (Object.prototype.hasOwnProperty.call(dbItems, key)) {
      itemsList.push({
        value: key,
        label: dbItems[key].name,
        description: dbItems[key].description,
      });
    }
  }
  // Sort items by priority
  itemsList.sort((a, b) => {
    const priorityA = dbItems[Number(a.value)].priority;
    const priorityB = dbItems[Number(b.value)].priority;
    return priorityA - priorityB;
  });
  return itemsList;
};

export const dbGenders: Record<number, DatabaseConstantInfo> = {
  1: { name: "Female", priority: 1, description: "Woman" },
  2: { name: "Male", priority: 2, description: "Man" },
};

export const dbProvinces: Record<number, DatabaseConstantInfo> = {
  1: { name: "Gauteng", priority: 2, description: "" },
  2: { name: "Western Cape", priority: 1, description: "" },
  3: { name: "Limpopo", priority: 3, description: "" },
  4: { name: "Mpumalanga", priority: 4, description: "" },
  5: { name: "KwaZulu-Natal", priority: 5, description: "" },
  6: { name: "Eastern Cape", priority: 6, description: "" },
  7: { name: "Free State", priority: 7, description: "" },
  8: { name: "North West", priority: 8, description: "" },
  9: { name: "Northern Cape", priority: 9, description: "" },
};
