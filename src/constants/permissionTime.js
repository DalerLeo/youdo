import t from '../helpers/translate'

export const ON_FULL_DAY = 1
export const OFF_FULL_DAY = 2
export const ON_TIME = 3
export const OFF_TIME = 4
export const getPermName = {
  1: t('Работает полный день'),
  2: t('Не работает в течении дня'),
  3: t('Работает в данные часы'),
  4: t('Не работает в данные часы')
}
