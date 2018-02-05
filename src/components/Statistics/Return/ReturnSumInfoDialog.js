import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import numberFormat from '../../../helpers/numberFormat'
import t from '../../../helpers/translate'
import Loader from '../../Loader'

const enhance = compose(
    injectSheet({
        wrapper: {
            borderTop: '1px solid #efefef',
            paddingTop: '7px'
        },
        innerWrap: {
            marginBottom: '5px',
            '& > div:first-child': {
                fontSize: '13px',
                fontWeight: '500',
                color: '#666'
            },
            '& > div': {
                fontSize: '15px',
                fontWeight: '600',
                color: '#333'
            }
        }
    })
)

const SalesInfoDialog = enhance((props) => {
    const {
        classes,
        statsData
    } = props

    const loading = _.get(statsData, 'loading')
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
        <div className={classes.wrapper}>
            {loading
            ? <div>
                    <Loader size={0.75}/>
                </div>
            : <div>
                    {!noCashData &&
                    <div className={classes.innerWrap}>
                    <div >{t('Наличными')}:</div>
                    {_.map(cashSummary, (obj, i) => {
                        const currency = _.get(obj, 'currency')
                        const amount = _.get(obj, 'total')
                        return <div className={classes.amount} key={i}>{numberFormat(amount, currency)}</div>
                    })}
                    </div>}
                {!noBankData &&
                    <div className={classes.innerWrap}>
                    <div>{t('Перечислением')}:</div>
                    {_.map(bankSummary, (obj, i) => {
                        const currency = _.get(obj, 'currency')
                        const amount = _.get(obj, 'total')
                        return <div className={classes.amount} key={i}>{numberFormat(amount, currency)}</div>
                    })}
                    </div>}
                </div>
            }
        </div>
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