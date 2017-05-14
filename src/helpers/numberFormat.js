const numberFormat = (amount, suffix) => {
    const formatter = new Intl.NumberFormat('ru-RU')

    return formatter.format(amount) + ' ' + (suffix || '')
}

export default numberFormat
