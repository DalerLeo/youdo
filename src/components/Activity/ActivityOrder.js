import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import paymentTypeFormat from '../../helpers/paymentTypeFormat'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Info from 'material-ui/svg-icons/action/info-outline'
import Tooltip from '../ToolTip'

const enhance = compose(
    injectSheet({
        loader: {
            minWidth: '300px',
            height: '300px',
            marginRight: '30px',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        padding: {
            padding: '20px 30px'
        },
        block: {
            paddingRight: '20px'
        },
        blockTitle: {
            padding: '15px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: '10px',
            '& strong': {
                fontWeight: 'bold'
            }
        },
        blockItems: {
            overflowY: 'auto',
            height: 'calc(100% - 80px)',
            paddingRight: '10px'
        },
        tube: {
            padding: '20px 15px',
            marginBottom: '10px',
            width: '300px',
            cursor: 'pointer',
            transition: 'box-shadow 125ms ease-out !important',
            '&:hover': {
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px !important'
            }
        },
        tubeTitle: {
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between'
        },
        tubeTime: {
            fontSize: '10px',
            color: '#999'
        },
        status: {
            borderRadius: '2px',
            height: '4px',
            width: '30px'
        },
        statusGreen: {
            extend: 'status',
            background: '#92ce95'
        },
        statusRed: {
            extend: 'status',
            background: '#e57373'
        },
        tubeImg: {
            marginTop: '10px',
            '& img': {
                width: '100%',
                display: 'block',
                cursor: 'pointer'
            }
        },
        tubeImgDouble: {
            extend: 'tubeImg',
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                width: 'calc(50% - 4px)',
                position: 'relative',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '2px 8px',
                    color: '#fff',
                    background: '#333',
                    opacity: '0.8',
                    fontSize: '11px',
                    fontWeight: '600'
                },
                '&:first-child:after': {
                    content: '"до"'
                },
                '&:last-child:after': {
                    content: '"после"'
                }
            }
        },
        tubeInfo: {
            marginTop: '10px',
            lineHeight: '15px'
        }
    })
)

const dateFormat = (date, defaultText) => {
    return (date) ? moment(date).locale('ru').format('DD MMM YYYY - HH:mm') : defaultText
}

const ActivityOrder = enhance((props) => {
    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const {
        orderlistData,
        classes,
        orderDetails,
        summary,
        summaryLoading
    } = props

    const orderlistLoading = _.get(orderlistData, 'orderListLoading')
    const countSummary = _.get(summary, 'count')
    const cashSummary = numberFormat(_.get(summary, 'cash'), currentCurrency)
    const bankSummary = numberFormat(_.get(summary, 'bank'), currentCurrency)
    const tooltipText = '<div>Сумма (нал): ' + cashSummary + '</div> <div>Сумма (пер): ' + bankSummary + '</div>'
    const orderList = _.map(_.get(orderlistData, 'data'), (item) => {
        const id = _.get(item, ['order', 'id'])
        const name = _.get(item, ['order', 'user', 'firstName']) + ' ' + _.get(item, ['order', 'user', 'secondName'])
        const createdDate = dateFormat(_.get(item, ['order', 'createdDate']))
        const orderPrice = numberFormat(_.get(item, ['order', 'totalPrice']), currentCurrency)
        const marketName = _.get(item, ['order', 'market', 'name'])
        const paymentType = paymentTypeFormat(_.get(item, ['order', 'paymentType']))

        return (
            <Paper key={id} zDepth={1} className={classes.tube} onClick={() => { orderDetails.handleOpenOrderDetails(id) }}>
                <div className={classes.tubeTitle}>
                    <span>{name}</span>
                    <div className={classes.statusGreen}> </div>
                </div>
                <div className={classes.tubeTime}>{createdDate}</div>
                <div className={classes.tubeInfo}>Сделка №{id} с магазина "{marketName}" на сумму {orderPrice} ({paymentType})
                </div>
            </Paper>
        )
    })

    if (_.isEmpty(orderList)) {
        return false
    } else if (orderlistLoading || summaryLoading) {
        return (
            <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>
        )
    }

    return (
        <div className={classes.block}>
            <div className={classes.blockTitle}>
                <strong>Cделки ({countSummary})</strong>
                <Tooltip position="left" text={tooltipText}>
                    <Info color="#666"/>
                </Tooltip>
            </div>
            <div className={classes.blockItems}>
                {orderList}
            </div>
        </div>
    )
})

ActivityOrder.PropTypes = {
    orderlistData: PropTypes.object,
    orderDetails: PropTypes.shape({
        openOrderDetails: PropTypes.bool.isRequired,
        orderItemLoading: PropTypes.bool.isRequired,
        handleOpenOrderDetails: PropTypes.func.isRequired,
        handleCloseOrderDetails: PropTypes.func.isRequired,
        data: PropTypes.object
    }).isRequired
}

export default ActivityOrder
