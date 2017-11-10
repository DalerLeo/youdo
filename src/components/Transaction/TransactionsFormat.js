import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import * as ROUTES from '../../constants/routes'
import {compose} from 'recompose'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import * as TRANS_TYPE from '../../constants/transactionTypes'

const enhance = compose()
const TransactionsFormat = enhance((props) => {
    const {type, order, user, client, handleClickAgentIncome, supply} = props
    const clientName = _.get(client, 'name')
    const userName = _.get(user, 'firstName') + ' ' + _.get(user, 'secondName')

    let output = null
    switch (type) {
        case TRANS_TYPE.FROM_TRANSFER: output = <span>Перевод с кассы</span>
            break
        case TRANS_TYPE.TO_TRANSFER: output = <span>Перевод на кассу</span>
            break
        case TRANS_TYPE.ORDER: output = <Link target="_blank" to={{
            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
            query: {search: order}
        }}>Оплата заказа №{order}</Link>
            break
        case TRANS_TYPE.INCOME: output = <span>Приход</span>
            break
        case TRANS_TYPE.OUTCOME: output = <span>Расход</span>
            break
        case TRANS_TYPE.INCOME_TO_CLIENT: output = <span>Приход на счет клиента <Link target="_blank" to={{
            pathname: ROUTES.CLIENT_BALANCE_LIST_URL, query: {search: client.id}
        }}><strong>{clientName}</strong></Link></span>
            break
        case TRANS_TYPE.OUTCOME_FROM_CLIENT: output = <span>Снято со счета клиента</span>
            break
        case TRANS_TYPE.INCOME_FROM_AGENT: output = <a onClick={handleClickAgentIncome}><strong>Приемка наличных с агента {userName}</strong></a>
            break
        case TRANS_TYPE.OUTCOME_FOR_SUPPLY_EXPANSE: output = <span>Расход на <Link target="_blank" to={{
            pathname: sprintf(ROUTES.SUPPLY_ITEM_PATH, supply), query: {search: supply}}}>поставку №{supply}</Link></span>
            break
        case TRANS_TYPE.SUPPLY_EXPENCE: output = <span>Доп. расход на поставку <Link target="_blank" to={{
            pathname: sprintf(ROUTES.SUPPLY_ITEM_PATH, supply), query: {search: supply}}}>№ {supply}</Link></span>
            break
        default: output = null
    }

    return (<span>{output}</span>)
})

TransactionsFormat.propTypes = {
    type: PropTypes.number.isRequired,
    order: PropTypes.number
}

export default TransactionsFormat
