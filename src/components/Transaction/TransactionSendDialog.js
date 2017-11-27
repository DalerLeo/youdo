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
        form: 'TransactionCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const chosenCashboxId = _.get(state, ['form', 'TransactionCreateForm', 'values', 'categoryId', 'value'])
        const amountFrom = _.get(state, ['form', 'TransactionCreateForm', 'values', 'amountFrom'])
        const amountTo = _.get(state, ['form', 'TransactionCreateForm', 'values', 'amountTo'])
        const amountFromPersent = _.get(state, ['form', 'TransactionCreateForm', 'values', 'amountFromPersent'])
        const amountToPersent = _.get(state, ['form', 'TransactionCreateForm', 'values', 'amountToPersent'])
        const currentCashbox = _.get(state, ['form', 'TransactionCreateForm', 'values', 'cashbox', 'value'])
        return {
            chosenCashboxId,
            amountFrom,
            amountTo,
            amountToPersent,
            amountFromPersent,
            currentCashbox
        }
    })
)

const HUNDRED = 100
const TransactionSendDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, cashboxData, chosenCashboxId, amountFrom, amountTo, amountFromPersent, amountToPersent, noCashbox, currentCashbox} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const cashboxId = noCashbox ? _.get(currentCashbox, 'id') : _.get(cashboxData, 'cashboxId')
    const cashbox = _.find(_.get(cashboxData, 'data'), {'id': cashboxId})
    const chosenCashbox = _.find(_.get(cashboxData, 'data'), {'id': _.toInteger(chosenCashboxId)})
    const courseOrPersent = _.get(cashbox, ['currency', 'name']) === _.get(chosenCashbox, ['currency', 'name']) && _.get(cashbox, 'type') !== _.get(chosenCashbox, 'type')
    const chosenCurrencyId = _.get(chosenCashbox, ['currency', 'id'])
    const currentCurrencyName = _.get(cashbox, ['currency', 'name'])
    const chosenCurrencyName = _.get(chosenCashbox, ['currency', 'name'])
    const customRate = _.toNumber(numberWithoutSpaces(amountFrom)) / _.toNumber(numberWithoutSpaces(amountTo))
    const customRatePersent = _.toNumber(numberWithoutSpaces(amountFromPersent)) * _.toNumber(numberWithoutSpaces(amountToPersent)) / HUNDRED
    const ROUND_VAL = 5

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Перевод</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '235px'}}>
                        <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        <div className={classes.field}>
                            {noCashbox
                                ? <div style={{marginTop: '15px'}}>
                                    <Field
                                        name="cashbox"
                                        className={classes.inputFieldCustom}
                                        component={CashboxSearchField}
                                        label="Текущая касса"
                                        fullWidth={true}/>
                                </div>
                                : <div className={classes.itemList}>
                                    <div className={classes.label}>Текущая касса:</div>
                                    <div style={{fontWeight: '600'}}>{_.get(cashbox, 'name')}</div>
                                </div>}
                            <Field
                                name="categoryId"
                                className={classes.inputFieldCustom}
                                component={CashboxTypeSearchField}
                                data-exclude-only={true}
                                cashbox={cashbox}
                                label="Касса получатель"
                                fullWidth={true}/>
                            {!courseOrPersent &&
                            <div>
                                <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                    <div style={{display: 'flex', alignItems: 'baseline', width: '48%'}}>
                                        {cashbox && <Field
                                            name="amountFrom"
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label="Сумма с кассы"
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>}
                                        <span style={{marginLeft: '10px'}}>{currentCurrencyName}</span>
                                    </div>
                                    {chosenCurrencyId &&
                                    <div style={{display: 'flex', alignItems: 'baseline', width: '48%'}}>
                                        <Field
                                            name="amountTo"
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label="Сумма в кассу"
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>
                                        <span style={{marginLeft: '10px'}}>{chosenCurrencyName}</span>
                                    </div>}
                                </div>
                                {(amountFrom && amountTo) &&
                                <div style={{padding: '10px 0'}}>
                                    Курс: <strong>1 {chosenCurrencyName}</strong> = {_.round(customRate, ROUND_VAL)} <strong>{currentCurrencyName}</strong>
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
                                            label="Сумма с кассы"
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>}
                                        <span style={{marginLeft: '10px'}}>{currentCurrencyName}</span>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'baseline', width: '48%'}}>
                                        <Field
                                            name="amountToPersent"
                                            className={classes.inputFieldCustom}
                                            component={TextField}
                                            label="Процент"
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>
                                        <span style={{marginLeft: '10px'}}>%</span>
                                    </div>
                                </div>
                                {(amountFromPersent && amountToPersent) &&
                                <div style={{padding: '10px 0'}}>
                                    Касса <i>{_.get(chosenCashbox, 'name')}</i> получает: <strong>{_.round(customRatePersent, ROUND_VAL)}</strong>
                                </div>}
                            </div>
                            }
                            <Field
                                name="comment"
                                className={classes.inputFieldCustom}
                                style={{lineHeight: '20px', fontSize: '13px'}}
                                component={TextField}
                                label="Комментарий..."
                                fullWidth={true}/>

                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Отправить"
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
