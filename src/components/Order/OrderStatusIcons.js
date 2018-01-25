import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import Available from 'material-ui/svg-icons/action/store'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import Transferred from 'material-ui/svg-icons/maps/local-shipping'
import Delivered from 'material-ui/svg-icons/action/assignment-turned-in'
import InProcess from 'material-ui/svg-icons/device/access-time'
import NotConfirmed from 'material-ui/svg-icons/alert/warning'
import Payment from 'material-ui/svg-icons/action/credit-card'
import IconButton from 'material-ui/IconButton'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'
import dateFormat from '../../helpers/dateFormat'
import {
    REQUESTED,
    NOT_CONFIRMED,
    READY,
    ZERO,
    CANCELLED,
    GIVEN,
    DELIVERED
} from '../../constants/backendConstants'

const OrderStatusIcons = (props) => {
    const {
        paymentDate,
        totalBalance,
        balanceToolTip,
        status
    } = props

    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 30,
            height: 30,
            padding: 0,
            zIndex: 0
        }
    }
    const now = moment().format('YYYY-MM-DD')
    const paymentDateFormatted = dateFormat(paymentDate)
    const paymentDifference = moment(paymentDate).diff(now, 'days')
    const PAY_PENDING = t('Оплата ожидается') + ': ' + paymentDateFormatted + '<br/>' + t('Ожидаемый платеж') + ': ' + balanceToolTip
    const PAY_DELAY = paymentDifference !== ZERO
        ? t('Оплата ожидалась') + ': ' + paymentDateFormatted + '<br/>' + t('Долг') + ': ' + balanceToolTip
        : t('Оплата ожидается сегодня') + '<br/>' + t('Сумма') + ': ' + balanceToolTip

    const getPaymentColor = () => {
        if (totalBalance > ZERO) {
            if (paymentDifference > ZERO) {
                return '#b7bbb7'
            } else if (paymentDifference === ZERO) {
                return '#f0ad4e'
            }
            return '#e57373'
        } else if (totalBalance === ZERO) {
            return '#81c784'
        }
        return '#b7bbb7'
    }
    const paymentIcon = status !== CANCELLED
    ? (
        <ToolTip position="bottom" text={(totalBalance > ZERO) && (paymentDifference <= ZERO)
            ? PAY_DELAY
            : ((totalBalance > ZERO) && moment(paymentDate).diff(now, 'days') > ZERO)
                ? PAY_PENDING
                : totalBalance === ZERO ? t('Оплачено') : ''}>
            <IconButton
                disableTouchRipple={true}
                iconStyle={iconStyle.icon}
                style={iconStyle.button}
                touch={true}>
                <Payment color={getPaymentColor()}/>
            </IconButton>
        </ToolTip>
    ) : null

    const getTooltip = (text, icon) => {
        return (
            <ToolTip position="bottom" text={text}>
                <IconButton
                    disableTouchRipple={true}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    touch={false}>
                    {icon}
                </IconButton>
            </ToolTip>
        )
    }
    const statusIcon = () => {
        switch (status) {
            case REQUESTED: return getTooltip(t('В процессе'), <InProcess color="#f0ad4e"/>)
            case READY: return getTooltip(t('Есть на складе'), <Available color="#f0ad4e"/>)
            case DELIVERED: return getTooltip(t('Доставлен'), <Delivered color="#81c784"/>)
            case GIVEN: return getTooltip(t('Передан доставщику'), <Transferred color="#f0ad4e"/>)
            case CANCELLED: return getTooltip(t('Заказ отменен'), <Canceled color='#e57373'/>)
            case NOT_CONFIRMED: return getTooltip(t('Не подтвержден'), <NotConfirmed color='#999'/>)
            default: return null
        }
    }
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
            {statusIcon()} {paymentIcon}
        </div>
    )
}

OrderStatusIcons.propTypes = {
    status: PropTypes.number.isRequired,
    paymentDate: PropTypes.any.isRequired,
    totalBalance: PropTypes.number.isRequired,
    balanceToolTip: PropTypes.string.isRequired
}

export default OrderStatusIcons
