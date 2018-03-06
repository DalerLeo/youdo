import React from 'react'
import _ from 'lodash'
import Pagination from '../../GridList/GridListNavPagination'
import t from '../../../helpers/translate'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import {hashHistory} from 'react-router'
import SendIcon from 'material-ui/svg-icons/content/reply-all'
import IconButton from 'material-ui/IconButton'
import dateTimeFormat from '../../../helpers/dateTimeFormat'
import {Row, Col} from 'react-flexbox-grid'

const iconStyles = {
    product: {
        width: 20,
        height: 20,
        color: '#81c784'
    },
    material: {
        width: 20,
        height: 20,
        color: '#999'
    },
    defected: {
        width: 20,
        height: 20,
        color: '#e57373'
    },
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
    },
    clearButton: {
        width: 23,
        height: 23,
        padding: 0,
        position: 'absolute',
        borderRadius: '100%',
        backgroundColor: '#fff',
        right: '20px',
        top: '5px'
    },
    clearIcon: {
        color: '#888',
        width: 23,
        height: 23
    },
    user: {
        marginRight: '5px',
        color: '#888',
        width: 22,
        height: 22
    },
    filterIcon: {
        color: '#fff',
        width: 18
    }
}

const ShipmentShift = (props) => {
    const {list, loading, filter, classes, handleSendOpenDialog} = props

    const handleFilterByRotation = (staff, shift) => {
        hashHistory.push(filter.createURL({staff, shift}))
    }

    const shifts = _.map(list, (item) => {
        const id = _.get(item, 'id')
        const shiftName = _.get(item, ['shift', 'name'])
        const shiftId = _.get(item, ['shift', 'id'])
        const openedTime = dateTimeFormat(_.get(item, 'openedTime'))
        const closedTime = _.get(item, 'closedTime') ? dateTimeFormat(_.get(item, 'closedTime')) : t('Не закончилась')
        const userName = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'firstName'])
        const userId = _.get(item, ['user', 'id'])
        const isTransferred = _.get(item, 'isTransferred')
        return (
            <Row key={id} className={classes.shift} onClick={() => handleFilterByRotation(userId, shiftId)}>
                <Col xs={3}>{userName}</Col>
                <Col xs={2}>{shiftName}</Col>
                <Col xs={3}>{openedTime}</Col>
                <Col xs={3}>{closedTime}</Col>
                <Col xs={1}>
                    <div className={classes.actionButtons}>
                        <ToolTip position="bottom"
                                 text={isTransferred ? t('Уже передан на склад') : t('Передать на склад')}>
                            <IconButton
                                iconStyle={iconStyles.icon}
                                disabled={isTransferred}
                                style={iconStyles.button}
                                disableTouchRipple={true}
                                onTouchTap={() => handleSendOpenDialog(id)}
                                touch={true}>
                                <SendIcon/>
                            </IconButton>
                        </ToolTip>
                    </div>
                </Col>
            </Row>
        )
    })
    return (
        !_.isEmpty(shifts)
        ? <div className={classes.productsBlock}>
            <div className={classes.pagination}>
                <Pagination filter={filter}/>
            </div>
            <Row className={classes.flexTitleShift}>
                <Col xs={3}><h4>{t('Работник')}</h4></Col>
                <Col xs={2}><h4>{t('Смена')}</h4></Col>
                <Col xs={3}><h4>{t('Начало смены')}</h4></Col>
                <Col xs={3}><h4>{t('Конец смены')}</h4></Col>
                <Col xs={1}/>
            </Row>
            {loading
                ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                : shifts}
        </div>
        : loading
            ? <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
            : <div className={classes.emptyQuery}>
                <div>{t('В этом периоде не найдено смен')}</div>
            </div>
    )
}

export default ShipmentShift
