import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, CashboxTypeSearchField, CashboxSearchField} from '../ReduxForm'
import MainStyles from '../Styles/MainStyles'
import normalizeNumber from '../ReduxForm/normalizers/normalizeNumber'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'

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
        nav: {
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '20px',
            color: 'black',
            borderBottom: '1px solid #efefef',
            '& button': {
                float: 'right',
                marginTop: '-5px !important'
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        label: {
            fontSize: '75%',
            color: '#999'
        },
        itemList: {
            marginTop: '20px',
            marginBottom: '10px'
        }
    })),
    reduxForm({
        form: 'TransactionSendForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const chosenCashboxId = _.get(state, ['form', 'TransactionSendForm', 'values', 'categoryId', 'value'])
        const amountFrom = _.get(state, ['form', 'TransactionSendForm', 'values', 'amountFrom'])
        const rate = _.get(state, ['form', 'TransactionSendForm', 'values', 'rate'])
        const amountFromPersent = _.get(state, ['form', 'TransactionSendForm', 'values', 'amountFromPersent'])
        const amountToPersent = _.get(state, ['form', 'TransactionSendForm', 'values', 'amountToPersent'])
        const currentCashbox = _.get(state, ['form', 'TransactionSendForm', 'values', 'cashbox', 'value'])
        return {
            chosenCashboxId,
            amountFrom,
            rate,
            amountToPersent,
            amountFromPersent,
            currentCashbox
        }
    })
)

const HUNDRED = 100
const TransactionSendDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, cashboxData, chosenCashboxId, amountFrom, rate, amountFromPersent, amountToPersent, noCashbox, currentCashbox} = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const cashboxId = noCashbox ? _.get(currentCashbox, 'id') : _.get(cashboxData, 'cashboxId')
    const cashbox = _.find(_.get(cashboxData, 'data'), {'id': cashboxId})
    const chosenCashbox = _.find(_.get(cashboxData, 'data'), {'id': _.toInteger(chosenCashboxId)})
    const courseOrPersent = _.get(cashbox, ['currency', 'name']) === _.get(chosenCashbox, ['currency', 'name']) && _.get(cashbox, 'type') !== _.get(chosenCashbox, 'type')
    const chosenCurrencyId = _.get(chosenCashbox, ['currency', 'id'])
    const currentCurrencyName = _.get(cashbox, ['currency', 'name'])
    const chosenCurrencyName = _.get(chosenCashbox, ['currency', 'name'])
    const convertedAmount = primaryCurrency === currentCurrencyName
        ? _.toNumber(numberWithoutSpaces(amountFrom)) * _.toNumber(numberWithoutSpaces(rate))
        : _.toNumber(numberWithoutSpaces(amountFrom)) / _.toNumber(numberWithoutSpaces(rate))
    const customRatePersent = _.toNumber(numberWithoutSpaces(amountFromPersent)) * _.toNumber(numberWithoutSpaces(amountToPersent)) / HUNDRED
    const ROUND_VAL = 5
    const onSubmit = handleSubmit(() => props.onSubmit(courseOrPersent && amountToPersent).catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '250px'} : {width: '350px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{t('Перевод')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent} style={{padding: '0'}}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '235px'}}>
                        {loading ? <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        : <div className={classes.field}>
                            {noCashbox
                                ? <div style={{marginTop: '15px'}}>
                                    <Field
                                        name="cashbox"
                                        className={classes.inputFieldCustom}
                                        component={CashboxSearchField}
                                        label={t('Текущая касса')}
                                        fullWidth={true}/>
                                </div>
                                : <div className={classes.itemList}>
                                    <div className={classes.label}>{t('Текущая касса')}:</div>
                                    <div style={{fontWeight: '600'}}>{_.get(cashbox, 'name')}</div>
                                </div>}
                            <Field
                                name="categoryId"
                                className={classes.inputFieldCustom}
                                component={CashboxTypeSearchField}
                                data-exclude-only={true}
                                cashbox={cashbox}
                                label={t('Касса получатель')}
                                fullWidth={true}/>
                            {!courseOrPersent &&
                            <div>
                                <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                    <div style={{display: 'flex', alignItems: 'baseline', width: '48%'}}>
                                        {cashbox && <Field
                                            name="amountFrom"
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label={t('Сумма с кассы')}
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>}
                                        <span style={{marginLeft: '10px'}}>{currentCurrencyName}</span>
                                    </div>
                                    {chosenCurrencyId &&
                                    <div style={{display: 'flex', alignItems: 'baseline', width: '48%'}}>
                                        <Field
                                            name="rate"
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label={t('Курс')}
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>
                                    </div>}
                                </div>
                                {(amountFrom && rate) &&
                                <div style={{padding: '10px 0'}}>
                                    Сумма перевода: <strong>{numberFormat(_.round(convertedAmount, ROUND_VAL), chosenCurrencyName)}</strong>
                                </div>}
                            </div>
                            }
                            {courseOrPersent &&
                            <div>
                                <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                    <div style={{display: 'flex', alignItems: 'baseline', width: '48%'}}>
                                        {cashbox && <Field
                                            name="amountFromPersent"
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label={t('Сумма с кассы')}
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>}
                                        <span style={{marginLeft: '10px'}}>{currentCurrencyName}</span>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'baseline', width: '48%'}}>
                                        <Field
                                            name="amountToPersent"
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label={t('Процент')}
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>
                                        <span style={{marginLeft: '10px'}}>%</span>
                                    </div>
                                </div>
                                {(amountFromPersent && amountToPersent) &&
                                <div style={{padding: '10px 0'}}>
                                    Касса <i>{_.get(chosenCashbox, 'name')}</i> получает: <strong>{numberFormat(_.round(customRatePersent, ROUND_VAL), chosenCurrencyName)} </strong>
                                </div>}
                            </div>
                            }
                            <Field
                                name="comment"
                                className={classes.inputFieldCustom}
                                style={{lineHeight: '20px', fontSize: '13px'}}
                                component={TextField}
                                label={t('Комментарий') + '...'}
                                fullWidth={true}/>

                        </div>}
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Отправить')}
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

TransactionSendDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    cashboxData: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default TransactionSendDialog
