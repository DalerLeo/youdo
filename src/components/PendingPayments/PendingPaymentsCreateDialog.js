import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {CashboxSearchField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const PENDING_PAYMENTS_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
            marginTop: '10px'
        },
        cashbox: {
            padding: '0 30px 20px',
            margin: '0 -30px',
            background: '#f1f5f8'
        }
    })),
    reduxForm({
        form: 'PendingPaymentsCreateForm',
        enableReinitialize: true
    })
)

const PendingPaymentsCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, detailData, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    const supply = _.get(detailData, ['data', 'supply'])
    const currency = _.get(detailData, ['data', 'currency'])
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
            contentStyle={loading ? {width: '300px'} : {width: '350px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Расход</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '220px'}}>
                        <div className={classes.loader}>
                            <CircularProgress size={80} thickness={5}/>
                        </div>
                        <div className={classes.field}>
                            <div className={classes.info}>
                                <div className={classes.infoHeader}>
                                    <div>{supplier}</div>
                                    <div>Поставка №{supplyId}</div>
                                </div>
                                <div className={classes.infoSummary}>
                                    <div>Сумма заказа: <span style={{marginLeft: '10px'}}>{summary} {currencyName}</span></div>
                                </div>
                            </div>
                            <div className={classes.cashbox}>
                                <Field
                                    name="type"
                                    className={classes.inputField}
                                    component={CashboxSearchField}
                                    label="Касса получатель"
                                    fullWidth={true}
                                />
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
