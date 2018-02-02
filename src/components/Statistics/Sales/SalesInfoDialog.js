import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import numberFormat from '../../../helpers/numberFormat'
import t from '../../../helpers/translate'
import Paper from 'material-ui/Paper'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            top: '0',
            left: '100%',
            whiteSpace: 'nowrap',
            zIndex: '999'
        },
        salesType: {
            padding: '10px 20px',
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

const SalesInfoDialog = enhance((props) => {
    const {
        classes,
        statsData
    } = props
    const data = _.get(statsData, 'data')
    const cashList = _.filter(data, {'paymentType': 'cash'})
    const bankList = _.filter(data, {'paymentType': 'bank'})
    const getCurrency = (obj) => {
        return _.get(obj, ['currency', 'name'])
    }
    const cashSummary = _.map(cashList, (item) => {
        const currency = getCurrency(item)
        const fact = _.toNumber(_.get(item, 'factTotal'))
        const total = _.toNumber(_.get(item, 'total'))
        const returns = _.toNumber(_.get(item, 'returnTotal'))
        return {
            fact,
            total,
            returns,
            currency
        }
    })
    const bankSummary = _.map(bankList, (item) => {
        const currency = getCurrency(item)
        const fact = _.toNumber(_.get(item, 'factTotal'))
        const total = _.toNumber(_.get(item, 'total'))
        const returns = _.toNumber(_.get(item, 'returnTotal'))
        return {
            fact,
            total,
            returns,
            currency
        }
    })

    const noCashData = _.isEmpty(cashSummary)
    const noBankData = _.isEmpty(bankSummary)
    return (
         <Paper zDepth={2} className={classes.wrapper}>
             <div className={classes.salesType}>
                 <div className={classes.title}>{t('Фактические продажи')}</div>
                 {!noCashData &&
                 <div>
                     <i>{t('Нал')}:</i>
                     {_.map(cashSummary, (obj, i) => {
                         const currency = _.get(obj, 'currency')
                         const amount = _.get(obj, 'fact')
                         return <span className={classes.amount} key={i}>{numberFormat(amount, currency)}</span>
                     })}
                 </div>}
                 {!noBankData &&
                 <div>
                     <i>{t('Переч')}:</i>
                     {_.map(bankSummary, (obj, i) => {
                         const currency = _.get(obj, 'currency')
                         const amount = _.get(obj, 'fact')
                         return <span className={classes.amount} key={i}>{numberFormat(amount, currency)}</span>
                     })}
                 </div>}
             </div>

             <div className={classes.salesType}>
                 <div className={classes.title}>{t('Сумма продаж')}</div>
                 {!noCashData &&
                 <div>
                     <i>{t('Нал')}:</i>
                     {_.map(cashSummary, (obj, i) => {
                         const currency = _.get(obj, 'currency')
                         const amount = _.get(obj, 'total')
                         return <span className={classes.amount} key={i}>{numberFormat(amount, currency)}</span>
                     })}
                 </div>}
                 {!noBankData &&
                 <div>
                     <i>{t('Переч')}:</i>
                     {_.map(bankSummary, (obj, i) => {
                         const currency = _.get(obj, 'currency')
                         const amount = _.get(obj, 'total')
                         return <span className={classes.amount} key={i}>{numberFormat(amount, currency)}</span>
                     })}
                 </div>}
             </div>

             <div className={classes.salesType}>
                 <div className={classes.title}>{t('Сумма возвратов')}</div>
                 {!noCashData &&
                 <div>
                     <i>{t('Нал')}:</i>
                     {_.map(cashSummary, (obj, i) => {
                         const currency = _.get(obj, 'currency')
                         const amount = _.get(obj, 'returns')
                         return <span className={classes.amount} key={i}>{numberFormat(amount, currency)}</span>
                     })}
                 </div>}
                 {!noBankData &&
                 <div>
                     <i>{t('Переч')}:</i>
                     {_.map(bankSummary, (obj, i) => {
                         const currency = _.get(obj, 'currency')
                         const amount = _.get(obj, 'returns')
                         return <span className={classes.amount} key={i}>{numberFormat(amount, currency)}</span>
                     })}
                 </div>}
             </div>
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
