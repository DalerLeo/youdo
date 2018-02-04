import t from './translate'

const types = {
    supply: t('Поставка'),
    transfer: t('Передача'),
    stock_transfer: t('Передача'),
    'order transfer product': t('По заказу'),
    order_return: t('Возврат'),
    writeoff: t('Cписание'),
    delivery_return: t('Отсрочка доставки'),
    'order return accept': t('Возврат'),
    order: t('Заказ'),
    manufacture_return: t('Произведено'),
    manufacture_writeoff: t('Затрачено на производство')

}

const stockTypeFormat = (type) => {
    return types[type]
}

export default stockTypeFormat
