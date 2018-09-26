export const FROM_TRANSFER = 1
export const TO_TRANSFER = 2
export const ORDER = 3
export const INCOME = 4
export const OUTCOME = 5
export const INCOME_TO_CLIENT = 6
export const OUTCOME_FROM_CLIENT = 7
export const INCOME_FROM_AGENT = 8
export const SUPPLY_EXPENCE = 9
export const OUTCOME_FOR_SUPPLY_EXPENSE = 10
export const formattedType = {
  1: 'Перевод с кассы',
  2: 'Перевод на кассу',
  3: 'Оплата заказа',
  4: 'Приход',
  5: 'Расход',
  6: 'Приход на счет клиента',
  7: 'Снято со счета клиента',
  8: 'Приемка наличных с агента',
  9: 'Доп.расход на поставку',
  10: 'Расход на поставку'
}
