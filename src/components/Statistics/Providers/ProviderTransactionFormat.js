import PropTypes from 'prop-types'
import React from 'react'
import * as ROUTES from '../../../constants/routes'
import {compose} from 'recompose'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import * as TRANS_TYPE from '../../../constants/providerTransactions'
import t from '../../../helpers/translate'

const enhance = compose()
const ProviderTransactionFormat = enhance((props) => {
    const {type, supply} = props

    switch (type) {
        case TRANS_TYPE.PAYMENT: return <span>{t('Оплата')}</span>
        case TRANS_TYPE.FIRST_BALANCE: return <span>{t('Первоначальный баланс')}</span>
        case TRANS_TYPE.SUPPLY: return (
            <Link target={'_blank'}
                  to={{pathname: sprintf(ROUTES.SUPPLY_ITEM_PATH, supply), query: {search: supply, exclude: false}}}>
                {t('Поставка')} № {supply}
            </Link>
        )
        case TRANS_TYPE.SUPPLY_EXPENSE: return (
            <Link target={'_blank'}
                  to={{pathname: sprintf(ROUTES.SUPPLY_ITEM_PATH, supply), query: {search: supply, exclude: false, tab: 'expenses'}}}>
                {t('Расход на поставку')} №{supply}
            </Link>
        )
        case TRANS_TYPE.NONE_TYPE: return <span>{t('Без типа')}</span>
        case TRANS_TYPE.INCOME_FROM_PROVIDER: return <span>{t('Приход от поставщика')}</span>
        default: return <span>{t('Нет описания')}</span>
    }
})

ProviderTransactionFormat.propTypes = {
    type: PropTypes.number.isRequired,
    supply: PropTypes.number
}

export default ProviderTransactionFormat
