const groups = {
    'SupDir': 'Завсклад',
    'delivery': 'Доставщик',
    'agent': 'Агент',
    'merch': 'Мерчендайзер',
    'collector': 'Инкасатор',
    'cashier': 'Кассир',
    'supervisor': 'Супервайзер'
}

const userGroupFormat = (key) => {
    return groups[key]
}

export default userGroupFormat
