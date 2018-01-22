import React from 'react'
import PropTypes from 'prop-types'
import InProcess from 'material-ui/svg-icons/action/cached'
import IconButton from 'material-ui/IconButton'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'

const PENDING = 0
const IN_PROGRESS = 1
const COMPLETED = 2
const CANCELED = 3

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
        case PENDING: return getTooltip(t('Ожидает'), <InProcess color="#f0ad4e"/>)
        case IN_PROGRESS: return getTooltip(t('Ожидает'), <InProcess color="#f0ad4e"/>)
        case COMPLETED: return getTooltip(t('Завершен'), <DoneIcon color="#81c784"/>)
        case CANCELED: return getTooltip(t('Отменен'), <Canceled color='#e57373'/>)
        default: return null
    }
}

OrderReturnStatusIcons.propTypes = {
    status: PropTypes.number.isRequired
}

export default OrderReturnStatusIcons
