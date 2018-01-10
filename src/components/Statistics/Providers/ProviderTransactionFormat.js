import PropTypes from 'prop-types'
import React from 'react'
import * as ROUTES from '../../../constants/routes'
import {compose} from 'recompose'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import * as TRANS_TYPE from '../../../constants/providerTransactions'

const enhance = compose()
const ProviderTransactionFormat = enhance((props) => {
    const {type, supply} = props

    switch (type) {
        case TRANS_TYPE.PAYMENT: return <span>Оплата</span>
        case TRANS_TYPE.FIRST_BALANCE: return <span>Первоначальный баланс</span>
        case TRANS_TYPE.SUPPLY: return (
            <Link target={'_blank'} to={{pathname: sprintf(ROUTES.SUPPLY_ITEM_PATH, supply), query: {search: supply, exclude: false}}}>Поставка №{supply}</Link>
        )
        case TRANS_TYPE.NONE_TYPE: return <span>Без типа</span>
        case TRANS_TYPE.INCOME_FROM_PROVIDER: return <span>Приход от поставщика</span>
        default: return <span>Нет описания</span>
    }
})

ProviderTransactionFormat.propTypes = {
    type: PropTypes.number.isRequired,
    supply: PropTypes.number
}

export default ProviderTransactionFormat
