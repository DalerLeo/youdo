import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, CashboxTypeCurrencyField, normalizeNumber} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import numberformat from '../../helpers/numberFormat'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {convertCurrency} from '../../helpers/convertCurrency'
import CashboxCurrencyField from '../ReduxForm/CashboxCurrencyField'
import PendingPaymentRadioButton from '../ReduxForm/PendingPaymentRadioButton'

export const PENDING_PAYMENTS_CREATE_DIALOG_OPEN = 'openCreateDialog'
const ORDERING_CURRENCY = 1
const INDIVIDUAL = 2
const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const latLng = (_.get(errors, 'lat') || _.get(errors, 'lon')) && 'Location is required.'

    throw new SubmissionError({
        ...errors,
        latLng,
        _error: nonFieldErrors
    })
}
const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        info: {
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline'
        },
        infoHeader: {
            fontWeight: '600',
            lineHeight: '20px'
        },
        infoSummary: {
            color: '#666',
            marginTop: '10px'
        },
        cashbox: {
            position: 'relative'
        },
        bold: {
            fontWeight: 'bold'
        },
        customCurrency: {
            position: 'absolute',
            bottom: '8px',
            right: '32px'
        },
        half: {
            width: '45%',
            display: 'flex',
            alignItems: 'baseline'
        },
        halfSecond: {
            width: '45%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginBottom: '8px'
        }
    })),
    reduxForm({
        form: 'PendingPaymentsCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const currencyRate = _.toInteger(_.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'currencyRate']))
        const customRate = _.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'customRate'])
        const amountValue = _.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'amount'])
        const currency = _.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'cashbox', 'value', 'currency', 'name'])

        return {
            currencyRate,
            customRate,
            amountValue,
            currency
        }
    }),
)

const PendingPaymentsCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, detailData, classes, currencyRate, convert, amountValue, customRate, currency, hasMarket} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const ZERO = 0
    const id = _.get(detailData, 'id')
    const primaryCurrency = _.get(detailData, ['data', 'currency', 'name'])
    const primaryCurrencyId = _.get(detailData, ['data', 'currency', 'id'])
    const client = _.get(detailData, ['data', 'client'])
    const marketName = _.get(detailData, ['data', 'market', 'name'])
    const paymentType = _.get(detailData, ['data', 'paymentType'])
    const paymentTypeOutput = paymentType === 'bank' ? 'банковский счет' : 'наличный'
    const totalBalance = numberformat(_.get(detailData, ['data', 'totalBalance']), primaryCurrency)
    const totalPrice = numberformat(_.get(detailData, ['data', 'totalPrice']), primaryCurrency)
    const clientName = _.get(client, 'name')
    const currentRate = (currencyRate === INDIVIDUAL) ? customRate : _.get(convert, ['data', 'amount'])
    const convertAmount = convertCurrency(amountValue, currentRate)
    const createdDate = _.get(detailData, ['data', 'createdDate'])

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '600px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Оплата</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '220px'}}>
                        <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        <div className={classes.field}>
                            <div className={classes.info}>
                                <div className={classes.infoHeader}>
                                    <div><span className={classes.infoSummary}>Клиент:</span> {clientName}</div>
                                    {hasMarket && <div><span className={classes.infoSummary}>Магазин:</span> {marketName}</div>}
                                    <div><span className={classes.infoSummary}>Заказ №:</span> {id}</div>
                                </div>
                                <div className={classes.infoHeader}>
                                    <div><span className={classes.infoSummary}>Тип оплаты:</span> {paymentTypeOutput}</div>
                                    <div><span className={classes.infoSummary}>Сумма заказа:</span> {totalPrice}</div>
                                    <div><span className={classes.infoSummary}>Остаток: </span> {totalBalance} </div>
                                </div>
                            </div>
                            <div className={classes.cashbox}>
                                {!_.get(detailData, 'detailLoading') &&
                                <Field
                                    name="cashbox"
                                    className={classes.inputFieldCustom}
                                    component={CashboxTypeCurrencyField}
                                    currency={_.get(detailData, ['data', 'currency', 'id'])}
                                    paymentType={_.get(detailData, ['data', 'paymentType'])}
                                    label="Касса получатель"
                                    fullWidth={true}/>}
                                <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                    <div className={classes.half}>
                                        <Field
                                            name="amount"
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label="Сумма"
                                            normalize={normalizeNumber}
                                            fullWidth={true}
                                        />
                                        <CashboxCurrencyField/>
                                    </div>
                                    {(currency !== primaryCurrency && _.toNumber(numberWithoutSpaces(amountValue)) > ZERO) && <div className={classes.halfSecond}>
                                        <div> После конвертации: <span className={classes.bold}>{convertAmount} {primaryCurrency}</span></div>
                                    </div>}
                                </div>

                                <Field
                                    name="currencyRate"
                                    createdDate={(currencyRate === ORDERING_CURRENCY) && createdDate}
                                    primaryCurrency={primaryCurrency}
                                    primaryCurrencyId={primaryCurrencyId}
                                    component={PendingPaymentRadioButton}
                                />
                                {(currencyRate === INDIVIDUAL && currency !== primaryCurrency)
                                    ? <div className={classes.customCurrency}>
                                        <Field
                                            component={TextField}
                                            label="Введите курс"
                                            normalize={normalizeNumber}
                                            fullWidth={true}
                                            className={classes.inputFieldCustom}
                                            name="customRate"/>
                                    </div>
                                    : (currency && currency !== primaryCurrency)
                                        ? <div className={classes.customCurrency}>
                                            Курс: {numberformat(currentRate, currency)}</div>
                                        : null}

                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            className={classes.actionButton}
                            labelStyle={{fontSize: '13px'}}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

PendingPaymentsCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default PendingPaymentsCreateDialog
