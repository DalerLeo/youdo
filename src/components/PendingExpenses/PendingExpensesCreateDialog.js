import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import numberFormat from '../../helpers/numberFormat'
import toCamelCase from '../../helpers/toCamelCase'
import {ExpensiveCategorySearchField, CashboxTypeSearchField, TextField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

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
            padding: '20px 0'
        },
        infoHeader: {
            fontWeight: '600',
            lineHeight: '20px'
        },
        infoSummary: {
            color: '#666',
            marginTop: '10px',
            textAlign: 'right',
            maxWidth: '50%'
        },
        cashbox: {
            padding: '5px 30px 15px',
            margin: '0 -30px',
            background: '#f1f5f8'
        }
    })),
    reduxForm({
        form: 'PendingExpensesCreateForm',
        enableReinitialize: true
    })
)

const PendingExpensesCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, detailData, classes, itemBalance, cashbox} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    const supply = _.get(detailData, ['data', 'supply'])
    const currency = _.get(detailData, ['data', 'currency'])
    const comment = _.get(detailData, ['data', 'comment'])
    const currencyName = _.get(currency, 'name')
    const summary = _.get(detailData, ['data', 'amount'])
    const supplyId = _.get(supply, 'id')
    const supplier = _.get(supply, ['provider', 'name'])

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
                <span>Расход</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
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
                                    <div>Поставщик: {supplier}</div>
                                    <div>Поставка №: {supplyId}</div>
                                </div>
                                <div className={classes.infoSummary}>
                                    <div><strong style={{marginRight: '10px'}}>Сумма расхода:</strong>
                                        <span>{numberFormat(summary, currencyName)}</span></div>
                                    <div><strong style={{marginRight: '10px'}}>Остаток:</strong>
                                        <span>{numberFormat(itemBalance, currencyName)}</span></div>
                                    <div><strong style={{marginRight: '10px'}}>Описание:</strong> <span>{comment}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.cashbox}>
                                <Field
                                    name="categoryId"
                                    component={ExpensiveCategorySearchField}
                                    label="Категория расхода"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="cashbox"
                                    className={classes.inputFieldCustom}
                                    component={CashboxTypeSearchField}
                                    cashbox={cashbox}
                                    label="Касса получатель"/>
                                <div style={{display: 'flex'}}>
                                    <Field
                                        name="amount"
                                        className={classes.inputFieldCustom}
                                        component={TextField}
                                        label="Cумма"/>
                                    <span style={{padding: '29px 10px 0'}}> {currencyName}</span>
                                </div>
                                <Field
                                    name="comment"
                                    className={classes.inputFieldCustom}
                                    component={TextField}
                                    label="Комментарий"
                                    fullWidth={true}/>
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

PendingExpensesCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default PendingExpensesCreateDialog
