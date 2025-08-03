import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { FilterType } from "../home/home.dto";

dayjs.extend(utc);

export function getDateRange(
  filterType: FilterType,
  baseDate: string,
): {
  startDate: Date;
  endDate: Date;
} {
  const date = dayjs.utc(baseDate);

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
