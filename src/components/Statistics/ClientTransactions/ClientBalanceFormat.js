import PropTypes from 'prop-types'
import React from 'react'
import * as ROUTES from '../../../constants/routes'
import {compose} from 'recompose'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import * as TRANS_TYPE from '../../../constants/clientBalanceInfo'
import t from '../../../helpers/translate'

const enhance = compose()
const ClientBalanceFormat = enhance((props) => {
    const {type, order, orderReturn} = props

    let output = null
    switch (type) {
        case TRANS_TYPE.PAYMENT: output = <span>{t('Оплата')}</span>
            break
        case TRANS_TYPE.FIRST_BALANCE: output = <span>{t('Первоначальный баланс')}</span>
            break
        case TRANS_TYPE.ORDER_RETURN: output = <Link to={{
            pathname: sprintf(ROUTES.RETURN_ITEM_PATH, orderReturn),
            query: {search: orderReturn, exclude: false}
        }} target="_blank">{t('Возврат')} № {orderReturn}</Link>
            break
        case TRANS_TYPE.ORDER: output = <Link to={{
            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
            query: {search: order, exclude: false}
        }} target="_blank">{t('Заказ')} № {order}</Link>
            break
        case TRANS_TYPE.EXPENSE: output = <span>{t('Расход')}</span>
            break
        case TRANS_TYPE.CANCEL: output = <span>{t('Отмена')}</span>
            break
        case TRANS_TYPE.CANCEL_ORDER: output = <Link to={{
            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
            query: {search: order, exclude: false}
        }} target="_blank">{t('Отмена заказа')} № {order}</Link>
            break
        case TRANS_TYPE.CANCEL_ORDER_RETURN: output = <Link to={{
            pathname: sprintf(ROUTES.RETURN_ITEM_PATH, orderReturn),
            query: {search: orderReturn, exclude: false}
        }} target="_blank">{t('Отмена возврата ')} № {orderReturn}</Link>
            break
        case TRANS_TYPE.NONE_TYPE: output = <span>{t('Нет типа')}</span>
            break
        case TRANS_TYPE.ORDER_EDIT: output = <Link to={{
            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
            query: {search: order, exclude: false}
        }} target="_blank">{t('Редактирование заказа')} № {order}</Link>
            break
        case TRANS_TYPE.ORDER_DISCOUNT: output = <Link to={{
            pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
            query: {search: order, exclude: false}
        }} target="_blank">{t('Скидка на заказ')} № {order}</Link>
            break
        default: output = null
    }

    return (<span>{output}</span>)
})

ClientBalanceFormat.propTypes = {
    type: PropTypes.number.isRequired,
    order: PropTypes.number,
    orderReturn: PropTypes.number
}

export default ClientBalanceFormat
