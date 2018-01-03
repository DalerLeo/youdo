import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import numberFormat from '../../helpers/numberFormat'
import toCamelCase from '../../helpers/toCamelCase'
import {ExpensiveCategorySearchField, CashboxTypeSearchField, TextField, normalizeNumber} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
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
        dialog: {
            overflowY: 'auto !important'
        },
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
    const {open, loading, handleSubmit, onClose, classes, itemBalance, selectedDetails} = props
    const id = _.get(selectedDetails, 'id')
    const comment = _.get(selectedDetails, ['comment'])
    const currencyName = _.get(selectedDetails, ['currency', 'name'])
    const summary = _.get(selectedDetails, ['totalAmount'])
    const supplyId = _.get(selectedDetails, 'supplyId')
    const supplier = _.get(selectedDetails, ['provider', 'name'])
    const cashbox = {
        currency: _.get(selectedDetails, 'currency'),
        type: _.get(selectedDetails, 'paymentType')
    }
    const type = _.get(selectedDetails, 'type')

    const onSubmit = handleSubmit(() => props.onSubmit({id, type}).catch(validate))

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
                <span>{t('Расход')}</span>
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
                                    <div>{t('Поставщик')}: {supplier}</div>
                                    <div>{t('Поставка')} №: {supplyId}</div>
                                    <div>{t('Тип')}: {type === 'supply' ? t('Поставка') : t('Доп. расход')}</div>
                                </div>
                                <div className={classes.infoSummary}>
                                    <div><strong style={{marginRight: '10px'}}>{t('Сумма расхода')}:</strong>
                                        <span>{numberFormat(summary, currencyName)}</span></div>
                                    <div><strong style={{marginRight: '10px'}}>{t('Остаток')}:</strong>
                                        <span>{numberFormat(itemBalance, currencyName)}</span></div>
                                    <div><strong style={{marginRight: '10px'}}>{t('Описание')}:</strong> <span>{comment}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.cashbox}>
                                <Field
                                    name="categoryId"
                                    component={ExpensiveCategorySearchField}
                                    label={t('Категория расхода')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="cashbox"
                                    className={classes.inputFieldCustom}
                                    component={CashboxTypeSearchField}
                                    cashbox={cashbox}
                                    label={t('Касса получатель')}/>
                                <div style={{display: 'flex'}}>
                                    <Field
                                        name="amount"
                                        className={classes.inputFieldCustom}
                                        normalize={normalizeNumber}
                                        component={TextField}
                                        label={t('Cумма')}/>
                                    <span style={{alignSelf: 'center'}}> {currencyName}</span>
                                </div>
                                <Field
                                    name="comment"
                                    className={classes.inputFieldCustom}
                                    component={TextField}
                                    label={t('Комментарий')}
                                    fullWidth={true}/>
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Сохранить')}
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
