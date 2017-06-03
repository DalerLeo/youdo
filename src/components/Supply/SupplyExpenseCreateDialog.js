import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, CurrencySearchField} from '../ReduxForm'
import MainStyles from '../Styles/MainStyles'

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
        }
    })),
    reduxForm({
        form: 'SupplyExpenseCreateForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const ExpenseCreateDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes, loading} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Добавление расхода</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
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
                                        className={classes.inputFieldCustom}
                                        label="Сумма"
                                        fullWidth={true}/>
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
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Применить"
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
ExpenseCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default ExpenseCreateDialog
