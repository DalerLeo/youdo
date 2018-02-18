import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import paymentTypeFormat from '../../helpers/paymentTypeFormat'
import LinearProgress from '../LinearProgress'
import Paper from 'material-ui/Paper'
import Info from 'material-ui/svg-icons/action/info-outline'
import ToolTip from '../ToolTip'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import t from '../../helpers/translate'

const ONE = 1
const TWO = 2
const TEN = 10
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            position: 'relative',
            margin: '15px 0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex',
            '& > div': {
                background: 'transparent'
            }
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
            paddingRight: '10px',
            '& a': {
                fontWeight: '600',
                display: 'block',
                textAlign: 'center',
                '&:hover': {
                    textDecoration: 'underline'
                }
            }
        },
        tube: {
            padding: '20px 15px',
            marginBottom: '10px',
            width: '300px',
            cursor: 'pointer',
            transition: 'box-shadow 125ms ease-out !important',
            position: 'relative',
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
    }),
    withState('defaultPage', 'updateDefaultPage', TWO)
)

const ActivityOrder = enhance((props) => {
    const {
        orderlistData,
        classes,
        orderDetails,
        summary,
        summaryLoading,
        handleLoadMoreItems,
        defaultPage,
        updateDefaultPage
    } = props

    const type = _.meanBy(_.get(orderlistData, 'data'), (o) => {
        return _.get(o, 'type')
    })
    const orderlistLoading = _.get(orderlistData, 'orderListLoading')
    const groupByType = _.groupBy(summary, 'paymentType')
    const isEmpty = _.isEmpty(_.get(orderlistData, 'data')) && !orderlistLoading
    const countSummary = _.sumBy(summary, (item) => _.get(item, 'count'))
    const cashData = _.first(_.filter(groupByType, (item, index) => index === 'cash'))
    const bankData = _.first(_.filter(groupByType, (item, index) => index === 'bank'))
    const cashSummary = _.join(_.map(cashData, (item) => {
        return numberFormat(_.get(item, 'totalAmount'), _.get(item, 'currencyName'))
    }), ', ')
    const bankSummary = _.join(_.map(bankData, (item) => {
        return numberFormat(_.get(item, 'totalAmount'), _.get(item, 'currencyName'))
    }), ', ')
    const cashTooltip = cashSummary ? '<div>' + t('Сумма (нал)') + ': ' + cashSummary + '</div>' : ''
    const bankTooltip = bankSummary ? '<div>' + t('Сумма (нал)') + ': ' + bankSummary + '</div>' : ''
    const tooltipText = cashTooltip + bankTooltip
    const orderList = _.map(_.get(orderlistData, 'data'), (item) => {
        const id = _.get(item, ['order', 'id'])
        const name = _.get(item, ['order', 'user', 'firstName']) + ' ' + _.get(item, ['order', 'user', 'secondName'])
        const createdDate = dateTimeFormat(_.get(item, ['order', 'createdDate']), true)
        const currency = _.get(item, ['currency', 'name'])
        const orderPrice = numberFormat(_.get(item, ['order', 'totalPrice']), currency)
        const marketName = _.get(item, ['order', 'market', 'name'])
        const paymentType = paymentTypeFormat(_.get(item, ['order', 'paymentType']))

        return (
            <Paper
                key={id}
                zDepth={1}
                className={classes.tube}
                onClick={() => { orderDetails.handleOpenOrderDetails(id) }}>
                <div className={classes.tubeTitle}>
                    <span>{name}</span>
                    <div className={classes.statusGreen}/>
                </div>
                <div className={classes.tubeTime}>{createdDate}</div>
                <div className={classes.tubeInfo}>Сделка №{id} с магазина "{marketName}" на сумму {orderPrice} ({paymentType})
                </div>
            </Paper>
        )
    })

    if (isEmpty) {
        return null
    }

    return (
        <div className={classes.block}>
            <div className={classes.blockTitle}>
                <strong>{t('Cделки')} ({countSummary})</strong>
                <ToolTip position="left" text={tooltipText}>
                    <Info color="#666"/>
                </ToolTip>
            </div>
            <div className={classes.blockItems}>
                {orderList}
                {(orderlistLoading || summaryLoading)
                ? <div className={classes.loader}>
                    <LinearProgress/>
                </div>
                : (countSummary > TEN) && (orderlistData.data.length < countSummary) && <a onClick={() => {
                    handleLoadMoreItems(type, defaultPage)
                    updateDefaultPage(defaultPage + ONE)
                }}>{t('Загрузить еще')}...</a>}
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
