const types = {
    supply: 'Поставка',
    transfer: 'Передача',
    stock_transfer: 'Передача',
    'order transfer product': 'По заказу',
    order_return: 'Возврат',
    writeoff: 'Cписание',
    delivery_return: 'Отсрочка доставки',
    'order return accept': 'Возврат',
    order: 'Заказ'

}

const stockTypeFormat = (type) => {
    return types[type]
}

export default stockTypeFormat
