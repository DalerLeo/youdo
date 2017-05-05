import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import {Field, Fields, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import {
    CurrencySearchField,
    ProviderSearchField,
    StockSearchField,
    ExpenseListProductField,
    TextField,
    DateField
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'

export const SUPPLY_EXPENSE_CREATE_DIALOG_OPEN = 'openCreateDialog'
const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: '#333'
        }
    }),
    reduxForm({
        form: 'ExpenseCreateForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const customContentStyle = {
    width: '1000px',
    maxWidth: 'none'
}
const ExpenseCreateDialog = enhance((props) => {
    const {state, dispatch, open, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.body}
            autoScrollBodyContent={true}>
            <form onSubmit={onSubmit} scrolling="auto">
                expense dialog
            </form>
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
