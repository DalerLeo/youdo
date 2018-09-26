import _ from 'lodash'
const groups = {
  manager: 'Завсклад',
  delivery: 'Доставщик',
  agent: 'Агент',
  merch: 'Мерчендайзер',
  collector: 'Инкассатор',
  cashier: 'Кассир',
  supervisor: 'Супервайзер',
  changePrice: 'Может менять цену',
  changeRate: 'Может менять курс',
  change_price: 'Может менять цену',
  change_rate: 'Может менять курс',
  change_any_price: 'Может менять все цены',
  manufacture: 'Производство'
}

const userGroupFormat = (key) => {
  const hasIn = _.hasIn(groups, key)
  if (hasIn) {
    return groups[key]
  }
  return key
}

export default userGroupFormat
