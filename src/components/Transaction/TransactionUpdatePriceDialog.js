import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import TextField from '../ReduxForm/Basic/TextField'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import normalizeNumber from '../ReduxForm/normalizers/normalizeNumber'
import {convertCurrency} from '../../helpers/convertCurrency'
import Loader from '../Loader'
import {
    DivisionSearchField,
    PaymentTypeSearchField,
    UsersSearchField,
    CurrencySearchField
} from '../ReduxForm'
import RateRadioButton from '../ReduxForm/Transaction/RateRadioButton'
import getConfig from '../../helpers/getConfig'
import checkPermission from '../../helpers/checkPermission'
import {connect} from 'react-redux'
import t from '../../helpers/translate'

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
        fields: {
            width: '100%'
        },
        bodyContent: {
            '& > .row': {
                '& > div:last-child': {
                    textAlign: 'right'
                }
            }
        }
    })),
    reduxForm({
        form: 'ClientBalanceUpdateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const chosenCurrency = _.get(state, ['form', 'ClientBalanceUpdateForm', 'values', 'currency', 'value'])
        const chosenCurrencyName = _.get(state, ['form', 'ClientBalanceUpdateForm', 'values', 'currency', 'text'])
        const amount = _.get(state, ['form', 'ClientBalanceUpdateForm', 'values', 'amount'])
        const rate = _.toNumber(_.get(state, ['form', 'ClientBalanceUpdateForm', 'values', 'custom_rate']))
        return {
            chosenCurrency,
            chosenCurrencyName,
            rate,
            amount
        }
    })
)

const TransactionUpdatePriceDialog = enhance((props) => {
    const {
        classes,
        open,
        onClose,
        handleSubmit,
        loading,
        client,
        chosenCurrency,
        chosenCurrencyName,
        rate,
        amount,
        showOrderRate
    } = props

    const onSubmit = handleSubmit(() => props.onSubmit(_.get(client, 'id')))
    const primaryCurrency = _.toInteger(getConfig('PRIMARY_CURRENCY_ID'))
    const convert = convertCurrency(amount, rate)
    const divisionStatus = getConfig('DIVISIONS')
    const canSetCustomRate = checkPermission('can_set_custom_rate')
    const customRateField = (primaryCurrency !== chosenCurrency && chosenCurrency) &&
    (
            <Field
                name="custom_rate"
                component={TextField}
                className={classes.inputFieldCustom}
                label={t('Курс')}
                fullWidth={true}/>
        )
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{t('Изменение транзакции')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            {loading
                ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                : <div className={classes.bodyContent}>
                    <div style={{padding: '10px 30px'}}>{t('Клиент')}: <strong>{_.get(client, 'name')}</strong></div>
                    <form onSubmit={onSubmit} className={classes.form}>
                        <div className={classes.inContent} style={{minHeight: '100px'}}>
                            <div style={{width: '100%'}}>
                                <Field
                                    name="user"
                                    component={UsersSearchField}
                                    label={t('Пользователь')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="paymentType"
                                    component={PaymentTypeSearchField}
                                    label={t('Тип оплаты')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="amount"
                                    component={TextField}
                                    label={t('Сумма')}
                                    normalize={normalizeNumber}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                {divisionStatus && <Field
                                    name="division"
                                    component={DivisionSearchField}
                                    label={t('Организация')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>}
                                <Field
                                    name="currency"
                                    component={CurrencySearchField}
                                    label={t('Валюта')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                {(convert && rate && primaryCurrency !== chosenCurrency)
                                    ? <div className={classes.convert}>{t('После конвертации')}:
                                        <strong> {convert} {primaryCurrency}</strong>
                                    </div> : null}
                                <div style={{marginBottom: 15}}>
                                    <Field
                                        name="currencyRate"
                                        currency={chosenCurrencyName}
                                        rate={rate}
                                        showOrderRate={showOrderRate}
                                        canSetCustomRate={canSetCustomRate}
                                        customRateField={customRateField}
                                        component={RateRadioButton}
                                    />
                                </div>
                                <Field
                                    name="comment"
                                    style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                    component={TextField}
                                    label={t('Комментарий') + '...'}
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={3}
                                    fullWidth={true}/>
                            </div>
                        </div>
                        <div className={classes.bottomButton}>
                            <FlatButton
                                label={t('Сохранить')}
                                labelStyle={{fontSize: '13px'}}
                                type="submit"
                            />
                        </div>
                    </form>
                </div>}
        </Dialog>
    )
})

TransactionUpdatePriceDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

TransactionUpdatePriceDialog.defaultProps = {
    isUpdate: false
}

export default TransactionUpdatePriceDialog
