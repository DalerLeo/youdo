export const getCalendar = (firstDayWeek, daysInMonth, lastDayWeek) => {
  const TEN = 10
  const DAYS_PER_WEEK = 7
  const ONE = 1

  const calendarDays = []
  if (firstDayWeek !== ONE) {
    for (let i = 1; i < firstDayWeek; i++) {
      calendarDays.push({isEmpty: true})
    }
  } else if (firstDayWeek === ONE) {
    // DO NOTHING
  } else {
    for (let i = 1; i < DAYS_PER_WEEK; i++) {
      calendarDays.push({isEmpty: true})
    }
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dayItem = i < TEN ? '0' + i : i
    calendarDays.push({day: dayItem})
  }
  if (lastDayWeek !== DAYS_PER_WEEK) {
    for (let i = lastDayWeek; i < DAYS_PER_WEEK; i++) {
      calendarDays.push({isEmpty: true})
    }
  }
  return calendarDays
}

export const weekNames = [
  {id: 1, name: 'Пн'},
  {id: 2, name: 'Вт'},
  {id: 3, name: 'Ср'},
  {id: 4, name: 'Чт'},
  {id: 5, name: 'Пт'},
  {id: 6, name: 'Сб'},
  {id: 7, name: 'Вс'}
]
