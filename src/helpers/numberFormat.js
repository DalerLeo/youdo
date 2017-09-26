const numberFormat = (amount, suffix) => {
    const formatter = new Intl.NumberFormat('ru-RU')
    const ZERO_NUM = 0
    if (suffix) {
        return ((amount) ? formatter.format(amount) : ZERO_NUM) + ' ' + (suffix || '')
    }
    return ((amount) ? formatter.format(amount) : ZERO_NUM)
}

export default numberFormat
