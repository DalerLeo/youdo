import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field, SubmissionError} from 'redux-form'
import FlatButton from 'material-ui/FlatButton'
import {TextField, normalizeDiscount} from '../ReduxForm'
import Paper from 'material-ui/Paper'
import toCamelCase from '../../helpers/toCamelCase'

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
        form: {
            position: 'relative'
        },
        field: {
            width: '100%',
            padding: '10px',
            paddingLeft: '20px',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between'
        },
        inputFieldCustom: {
            width: '110px !important',
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important',
                textAlign: 'right'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important',
            minWidth: '50px !important'
        }
    }),
    reduxForm({
        form: 'OrderSetDiscountForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const OrderSetDiscountDialog = enhance((props) => {
    const {classes, handleSubmit, id, setOpenDiscountDialog} = props
    const onSubmit = handleSubmit(() => {
        props.onSubmit(id).catch(validate)
            .then(() => {
                setOpenDiscountDialog(false)
            })
    })

    return (
        <Paper zDepth={2}>
            <form onSubmit={onSubmit} className={classes.field}>
                <div><Field
                    name="percent"
                    component={TextField}
                    normalize={normalizeDiscount}
                    label="Размер скидки"
                    className={classes.inputFieldCustom}

                /> <span>%</span>
                </div>
                <FlatButton
                    label="OK"
                    style={{color: '#12aaeb'}}
                    className={classes.actionButton}
                    primary={true}
                    type="submit"
                />
            </form>
        </Paper>
    )
})
OrderSetDiscountDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default OrderSetDiscountDialog
