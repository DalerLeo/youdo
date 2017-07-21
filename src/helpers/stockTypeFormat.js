const stockTypeFormat = (type) => {
    if (type === 'supply') {
        return 'Постака'
    } else if (type === 'transfer' || type === 'stock_transfer') {
        return 'Передача'
    } else if (type === 'order transfer product') {
        return 'По заказу'
    } else if (type === 'order_return') {
        return 'Возврат'
    }
    return type
}

export default stockTypeFormat
