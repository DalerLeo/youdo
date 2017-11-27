import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import Loader from '../Loader'
import IconButton from 'material-ui/IconButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, CurrencySearchField, CheckBox, normalizeNumber, PaymentTypeSearchField} from '../ReduxForm'
import MainStyles from '../Styles/MainStyles'
import SupplyProductsSearchField from '../ReduxForm/Supply/SupplyProductsSearchField'
import {connect} from 'react-redux'

export const SUPPLY_EXPENSE_CREATE_DIALOG_OPEN = 'openSupplyExpenseCreateDialog'
const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    throw new SubmissionError({
        ...errors,
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
        inputHalfWrap: {
            flexBasis: '49%',
            width: '49%'
        },
        fieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        }
    })),
    reduxForm({
        form: 'SupplyExpenseCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const isChecked = _.get(state, ['form', 'SupplyExpenseCreateForm', 'values', 'linkToProduct'])
        return {
            isChecked
        }
    }),
)

const ExpenseCreateDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes, loading, isChecked} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '460px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Добавление расхода</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent} style={{minHeight: 'auto', paddingBottom: '20px', paddingTop: '20px'}}>
                        <div className={classes.field}>
                            <Field
                                name="comment"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label="Описание раскода"
                                fullWidth={true}/>
                            <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                <div className={classes.inputHalfWrap}>
                                    <Field
                                        name="amount"
                                        component={TextField}
                                        className={classes.fieldCustom}
                                        label="Сумма"
                                        fullWidth={true}
                                        normalize={normalizeNumber}/>
                                </div>
                                <div className={classes.inputHalfWrap}>
                                    <Field
                                        name="currency"
                                        component={CurrencySearchField}
                                        className={classes.inputFieldCustom}
                                        label="Валюта"
                                        fullWidth={true}/>
                                </div>
                            </div>
                            <Field
                                name="paymentType"
                                component={PaymentTypeSearchField}
                                className={classes.inputFieldCustom}
                                label="Тип оплаты"
                                fullWidth={true}/>
                            <Field
                                name="linkToProduct"
                                style={{margin: '20px 0 10px'}}
                                component={CheckBox}
                                label="Привязать к товару"
                            />
                            {isChecked && <Field
                                name="product"
                                label="Наименование товара"
                                component={SupplyProductsSearchField}
                                className={classes.inputFieldCustom}
                                fullWidth={true}
                            />}
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Применить"
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
ExpenseCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default ExpenseCreateDialog
