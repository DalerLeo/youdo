import React from 'react'
import PropTypes from 'prop-types'
import InProcess from 'material-ui/svg-icons/action/cached'
import IconButton from 'material-ui/IconButton'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'
import {
    ORDER_RETURN_PENDING,
    ORDER_RETURN_IN_PROGRESS,
    ORDER_RETURN_COMPLETED,
    ORDER_RETURN_CANCELED
} from '../../constants/backendConstants'

const OrderReturnStatusIcons = (props) => {
    const {status} = props

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
    switch (status) {
        case ORDER_RETURN_PENDING: return getTooltip(t('Ожидает'), <InProcess color="#f0ad4e"/>)
        case ORDER_RETURN_IN_PROGRESS: return getTooltip(t('Ожидает'), <InProcess color="#f0ad4e"/>)
        case ORDER_RETURN_COMPLETED: return getTooltip(t('Завершен'), <DoneIcon color="#81c784"/>)
        case ORDER_RETURN_CANCELED: return getTooltip(t('Отменен'), <Canceled color='#e57373'/>)
        default: return null
    }
}

OrderReturnStatusIcons.propTypes = {
    status: PropTypes.number.isRequired
}

export default OrderReturnStatusIcons
