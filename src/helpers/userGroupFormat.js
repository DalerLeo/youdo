const groups = {
    'SupDir': 'Завсклад',
    'delivery': 'Доставщик',
    'agent': 'Агент',
    'merch': 'Мерчендайзер',
    'collector': 'Инкасатор'
}

const userGroupFormat = (key) => {
    return groups[key]
}

export default userGroupFormat
