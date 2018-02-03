import t from '../helpers/translate'
export const PAYMENT = 1
export const FIRST_BALANCE = 2
export const ORDER_RETURN = 3
export const ORDER = 4
export const EXPENSE = 5
export const CANCEL = 6
export const CANCEL_ORDER = 7
export const CANCEL_ORDER_RETURN = 8
export const NONE_TYPE = 9
export const ORDER_EDIT = 10
export const ORDER_DISCOUNT = 11
export const formattedType = {
    1: t('Оплата'),
    2: t('Первоначальный баланс'),
    3: t('Возврат заказа'),
    4: t('Заказ'),
    5: t('Расход'),
    6: t('Отмена'),
    7: t('Отмена заказа'),
    8: t('Отмена возврата заказа'),
    9: t('Произвольный'),
    10: t('Изменение заказа'),
    11: t('Скидка на заказ')
}
