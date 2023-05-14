import dayjs from "dayjs";

export default function dateConverter(dateInput) {
  const date = new Date(dateInput);
  return dayjs(date).format("YYYY-MM-DD");
}
