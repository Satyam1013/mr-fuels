import dayjs from "dayjs";
import { FilterType } from "../home/home.dto";

export function getDateRange(
  filterType: FilterType,
  baseDate: string,
): {
  startDate: Date;
  endDate: Date;
} {
  const date = dayjs(baseDate);

  switch (filterType) {
    case FilterType.DAILY:
      return {
        startDate: date.startOf("day").toDate(),
        endDate: date.endOf("day").toDate(),
      };
    case FilterType.WEEKLY:
      return {
        startDate: date.startOf("week").toDate(),
        endDate: date.endOf("week").toDate(),
      };
    case FilterType.MONTHLY:
    default:
      return {
        startDate: date.startOf("month").toDate(),
        endDate: date.endOf("month").toDate(),
      };
  }
}
