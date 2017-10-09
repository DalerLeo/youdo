import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
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
        infiniteLoader: {
            extend: 'loader',
            height: '100px',
            marginRight: '0'
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
            width: '300px'
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

const ActivityPayment = enhance((props) => {
    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const {
        paymentlistData,
        classes,
        summary,
        summaryLoading
    } = props

    const paymentlistLoading = _.get(paymentlistData, 'paymentListLoading')
    const countSummary = _.get(summary, 'count')
    const cashSummary = numberFormat(_.get(summary, 'cash'), currentCurrency)
    const bankSummary = numberFormat(_.get(summary, 'bank'), currentCurrency)
    const tooltipText = '<div>Сумма (нал): ' + cashSummary + '</div> <div>Сумма (пер): ' + bankSummary + '</div>'
    const paymentList = _.map(_.get(paymentlistData, 'data'), (item) => {
        const id = _.get(item, ['clientTransaction', 'id'])
        const currency = _.get(item, ['clientTransaction', 'currency', 'name'])
        const amount = numberFormat(_.get(item, ['clientTransaction', 'amount']), currency)
        const name = _.get(item, ['clientTransaction', 'user', 'firstName']) + ' ' + _.get(item, ['clientTransaction', 'user', 'secondName'])
        const createdDate = dateFormat(_.get(item, ['clientTransaction', 'createdDate']))

        return (
            <Paper key={id} zDepth={1} className={classes.tube}>
                <div className={classes.tubeTitle}>
                    <span>{name}</span>
                </div>
                <div className={classes.tubeTime}>{createdDate}</div>
                <div className={classes.tubeInfo}>Принято {amount} с магазина "Магазин"</div>
            </Paper>
        )
    })

    if (_.isEmpty(paymentList)) {
        return false
    } else if (paymentlistLoading || summaryLoading) {
        return (
            <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>
        )
    }

    return (
        <div className={classes.block}>
            <div className={classes.blockTitle}>
                <strong>Сбор денег ({countSummary})</strong>
                <Tooltip position="left" text={tooltipText}>
                    <Info color="#666"/>
                </Tooltip>
            </div>
            <div className={classes.blockItems}>
                {paymentList}
            </div>
        </div>
    )
})

ActivityPayment.PropTypes = {
    paymentlistData: PropTypes.object
}

export default ActivityPayment
