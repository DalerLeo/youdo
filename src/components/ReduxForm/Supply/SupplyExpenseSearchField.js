import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import t from '../../../helpers/translate'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
    return axios().get(PATH.SUPPLY_EXPENSE_LIST)
        .then(({data}) => {
            const detail = _.find(data, {'id': id})
            return Promise.resolve(toCamelCase(detail))
        })
}

const SupplyExpenseSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={(value) => {
                const id = _.get(value, 'id')
                const supply = _.get(value, 'supply')
                const comment = _.get(value, 'comment') || '-'
                return (
                    <div>
                        <div>{t('Доп. расход')} №{id}</div>
                        <div>{t('Поставка')} №{supply}</div>
                        <div>{t('Комментарий')}: {comment}</div>
                    </div>
                )
            }}
            getOptions={search => searchFieldGetOptions(PATH.SUPPLY_EXPENSE_LIST, search, params, pageSize)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default SupplyExpenseSearchField
