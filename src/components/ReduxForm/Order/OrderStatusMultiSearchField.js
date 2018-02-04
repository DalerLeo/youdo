import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import t from '../../../helpers/translate'
const Items = [
    {id: 0, name: t('Запрос отправлен')},
    {id: 1, name: t('Есть на складе')},
    {id: 2, name: t('Передан доставщику')},
    {id: 3, name: t('Доставлен')},
    {id: 4, name: t('Отменен')},
    {id: 5, name: t('Не подтвержден')}
]
const getOptions = () => {
    return Promise.resolve(Items)
}

const CurrencySearchField = (props) => {
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={getOptions}
            getIdsOption={getOptions}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...props}
        />
    )
}

export default CurrencySearchField
