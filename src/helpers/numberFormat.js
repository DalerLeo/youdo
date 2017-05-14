const numberFormat = (amount, suffix) => {
    const formatter = new Intl.NumberFormat('ru-RU')
    const ZERO_NUM = 0
    return ((amount) ? formatter.format(amount) : ZERO_NUM) + ' ' + (suffix || '')
}

export default numberFormat
