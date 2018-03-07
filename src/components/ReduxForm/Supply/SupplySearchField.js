import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import t from '../../../helpers/translate'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
    return axios().get(PATH.SUPPLY_LIST)
        .then(({data}) => {
            const detail = _.find(data, {'id': id})
            return Promise.resolve(toCamelCase(detail))
        })
}

const SupplySearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={(value) => {
                const id = _.get(value, 'id')
                const provider = _.get(value, ['provider', 'name'])
                const contract = _.get(value, 'contract') || '-'
                return (
                    <div>
                        <div>{t('Поставка №')}{id}</div>
                        <div>{t('Поставщик')}: {provider}</div>
                        <div>{t('Номер договора')}: {contract}</div>
                    </div>
                )
            }}
            getOptions={search => searchFieldGetOptions(PATH.SUPPLY_LIST, search, params, pageSize)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default SupplySearchField
