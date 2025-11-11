import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"

export function getMonthMatrix(activeMonth: Date) {
  const start = startOfWeek(startOfMonth(activeMonth), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(activeMonth), { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start, end })
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
  return weeks
}

export function nextMonth(d: Date) {
  return addMonths(d, 1)
}

export function prevMonth(d: Date) {
  return addMonths(d, -1)
}

export function formatMonthYear(d: Date) {
  return format(d, "MMMM yyyy")
}

export function sameMonth(a: Date, b: Date) {
  return isSameMonth(a, b)
}
