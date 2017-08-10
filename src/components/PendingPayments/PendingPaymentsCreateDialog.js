import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, CashboxCashCustomField, CashboxBankCustomField, normalizeNumber} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import numberformat from '../../helpers/numberFormat'
import CashboxCurrencyField from '../ReduxForm/CashboxCurrencyField'
import PendingPaymentRadioButton from '../ReduxForm/PendingPaymentRadioButton'
import getConfig from '../../helpers/getConfig'

export const PENDING_PAYMENTS_CREATE_DIALOG_OPEN = 'openCreateDialog'
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
        inContent: {
            maxHeight: '52vh'
        },
        cashbox: {
            position: 'relative'
        },
        customCurrency: {
            position: 'absolute',
            bottom: '8px',
            right: '32px'
        }
    })),
    reduxForm({
        form: 'PendingPaymentsCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const currencyRate = _.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'currencyRate'])

        return {
            currencyRate
        }
    }),
)

const PendingPaymentsCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, detailData, classes, currencyRate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const ONE = 1
    const id = _.get(detailData, 'id')
    const client = _.get(detailData, ['data', 'client'])
    const marketName = _.get(detailData, ['data', 'market', 'name'])
    const paymentType = _.toInteger(_.get(detailData, ['data', 'paymentType']))
    const paymentTypeOutput = (Number(_.get(detailData, ['data', 'paymentType'])) === ONE) ? 'банковский счет' : 'наличный'
    const totalBalance = numberformat(_.get(detailData, ['data', 'totalBalance']), getConfig('PRIMARY_CURRENCY'))
    const totalPrice = numberformat(_.get(detailData, ['data', 'totalPrice']), getConfig('PRIMARY_CURRENCY'))
    const clientName = _.get(client, 'name')
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '450px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Оплата</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '220px'}}>
                        <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        <div className={classes.field}>
                            <div className={classes.info}>
                                <div className={classes.infoHeader}>
                                    <div><span className={classes.infoSummary}>Клиент:</span> {clientName}</div>
                                    <div><span className={classes.infoSummary}>Магазин:</span> {marketName}</div>
                                    <div><span className={classes.infoSummary}>Заказ №:</span> {id}</div>
                                </div>
                                <div className={classes.infoHeader}>
                                    <div><span className={classes.infoSummary}>Тип оплаты:</span> {paymentTypeOutput}</div>
                                    <div><span className={classes.infoSummary}>Сумма заказа:</span> {totalPrice}</div>
                                    <div><span className={classes.infoSummary}>Остаток: </span> {totalBalance} </div>
                                </div>
                            </div>
                            <div className={classes.cashbox}>
                                {(paymentType === ONE)
                                ? <Field
                                    name="cashbox"
                                    className={classes.inputFieldCustom}
                                    component={CashboxBankCustomField}
                                    label="Касса получатель"
                                    fullWidth={true}
                                />
                                : <Field
                                        name="cashbox"
                                        className={classes.inputFieldCustom}
                                        component={CashboxCashCustomField}
                                        label="Касса получатель"
                                        fullWidth={true}
                                    />}
                                <div className={classes.flex}>
                                    <Field
                                        name="amount"
                                        className={classes.inputFieldCustom}
                                        component={TextField}
                                        label="Сумма"
                                        value={null}
                                        normalize={normalizeNumber}
                                        fullWidth={true}
                                    />
                                    <CashboxCurrencyField/>
                                </div>

                                <Field
                                    name="currencyRate"
                                    style={{marginTop: '10px'}}
                                    component={PendingPaymentRadioButton}
                                    label="Текущий курс"
                                />
                                {_.toInteger(currencyRate) === _.toInteger(INDIVIDUAL)
                                    ? <div className={classes.customCurrency}>
                                        <Field
                                            component={TextField}
                                            label="Введите курс"
                                            normalize={normalizeNumber}
                                            fullWidth={true}
                                            className={classes.inputFieldCustom}
                                            name="customRate"/>
                                    </div> : null}

                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            className={classes.actionButton}
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
