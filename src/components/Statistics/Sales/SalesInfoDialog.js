import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import numberFormat from '../../../helpers/numberFormat'
import Paper from 'material-ui/Paper'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            top: '15px',
            left: '100%',
            whiteSpace: 'nowrap',
            zIndex: '999'
        },
        salesType: {
            padding: '10px 15px',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                borderBottom: 'none'
            }
        },
        title: {
            marginBottom: '5px',
            fontWeight: '600'
        },
        amount: {
            marginLeft: '5px',
            '&:last-child': {
                '&:after': {
                    display: 'none'
                }
            },
            '&:after': {
                content: '","'
            }
        }
    })
)

const listData = [
    {
        type: 'Фактические продажи',
        summary: {
            cash: [
                {currency: {id: 1, name: 'UZS'}, amount: 10000},
                {currency: {id: 2, name: 'USD'}, amount: 200}
            ],
            bank: [
                {currency: {id: 1, name: 'UZS'}, amount: 10000},
                {currency: {id: 2, name: 'USD'}, amount: 200}
            ]
        }
    },
    {
        type: 'Сумма продаж',
        summary: {
            cash: [
                {currency: {id: 1, name: 'UZS'}, amount: 10000},
                {currency: {id: 2, name: 'USD'}, amount: 200}
            ],
            bank: [
                {currency: {id: 1, name: 'UZS'}, amount: 10000},
                {currency: {id: 2, name: 'USD'}, amount: 200}
            ]
        }
    }
]

const SalesInfoDialog = enhance((props) => {
    const {
        classes
    } = props

    return (
         <Paper zDepth={2} className={classes.wrapper}>
             {_.map(listData, (item, index) => {
                 return (
                     <div className={classes.salesType} key={index}>
                         <div className={classes.title}>{item.type}</div>
                         <div>
                             <span>Нал:</span>
                             {_.map(item.summary.cash, (obj, i) => {
                                 const currency = _.get(obj, ['currency', 'name'])
                                 const amount = _.get(obj, 'amount')
                                 return <span className={classes.amount} key={i}>{numberFormat(amount, currency)}</span>
                             })}
                         </div>
                         <div>
                             <span>Переч:</span>
                             {_.map(item.summary.bank, (obj, i) => {
                                 const currency = _.get(obj, ['currency', 'name'])
                                 const amount = _.get(obj, 'amount')
                                 return <span className={classes.amount} key={i}>{numberFormat(amount, currency)}</span>
                             })}
                         </div>
                     </div>
                 )
             })}
         </Paper>
    )
})

SalesInfoDialog.propTyeps = {
    filter: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    loading: PropTypes.bool,
    detailData: PropTypes.object
}

export default SalesInfoDialog
