import PropTypes from 'prop-types'
import React from 'react'
import * as ROUTES from '../../../constants/routes'
import {compose} from 'recompose'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import * as TRANS_TYPE from '../../../constants/clientBalanceInfo'

const enhance = compose()
const TransactionsFormat = enhance((props) => {
    const {type, order, orderReturn} = props

    let output = null
    switch (type) {
        case TRANS_TYPE.PAYMENT: output = <span>Оплата</span>
            break
        case TRANS_TYPE.FIRST_BALANCE: output = <span>Первоначальный баланс</span>
            break
        case TRANS_TYPE.ORDER_RETURN: output = <Link to={{
            pathname: sprintf(ROUTES.RETURN_ITEM_PATH, orderReturn),
            query: {search: orderReturn}
        }} target="_blank">Возврат №{orderReturn}</Link>
            break
        case TRANS_TYPE.ORDER: output = <Link to={{
            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
            query: {search: order}
        }} target="_blank">Заказ {order}</Link>
            break
        case TRANS_TYPE.EXPENSE: output = <span>Расход</span>
            break
        case TRANS_TYPE.CANCEL: output = <span>Отмена</span>
            break
        case TRANS_TYPE.CANCEL_ORDER: output = <Link to={{
            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
            query: {search: order}
        }} target="_blank">Отмена заказа №{order}</Link>
            break
        case TRANS_TYPE.CANCEL_ORDER_RETURN: output = <Link to={{
            pathname: sprintf(ROUTES.RETURN_ITEM_PATH, orderReturn),
            query: {search: orderReturn}
        }} target="_blank">Отмена возврата №{orderReturn}</Link>
            break
        case TRANS_TYPE.NONE_TYPE: output = <span>Нет типа</span>
            break
        case TRANS_TYPE.ORDER_EDIT: output = <span>Редактирование заказа</span>
            break
        case TRANS_TYPE.ORDER_DISCOUNT: output = <span>Скидка</span>
            break
        default: output = null
    }

    return (<span>{output}</span>)
})

TransactionsFormat.propTypes = {
    type: PropTypes.number.isRequired,
    order: PropTypes.number,
    orderReturn: PropTypes.number
}

export default TransactionsFormat
