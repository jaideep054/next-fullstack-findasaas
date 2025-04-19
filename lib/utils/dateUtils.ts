export type DateFilter =
  | "today"
  | "yesterday"
  | "last_2_days"
  | "last_week"
  | "last_month"
  | string;

export const getDateRange = (filter: DateFilter): { startDate: Date; endDate: Date } => {
  const now = new Date();
  let startDate: Date, endDate: Date;

  switch (filter) {
    case "today":
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      break;
    case "yesterday":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "last_2_days":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      break;
    case "last_week":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      break;
    case "last_month":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      break;
    default:
      startDate = new Date(0); // epoch
      endDate = new Date();
  }

  return { startDate, endDate };
};
