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
import {TextField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const SET_CURRENCY_DIALOG_OPEN = 'openSetCurrencyDialog'

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
        currency: {
            display: 'flex',
            paddingTop: '25px',
            alignItems: 'center',
            width: '100%'
        }
    })),
    reduxForm({
        form: 'SetCurrencyForm',
        enableReinitialize: true
    })
)

const SetCurrencyDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, currencyData, currentCurrency, currentId} = props
    const currency = _.get(_.find((_.get(currencyData, 'data')), {'id': currentId}), 'name')
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '280px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Курс</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.inContent} style={{minHeight: '100px'}}>
                        <div className={classes.field}>
                            <div className={classes.currency}>
                                <div>1 {currentCurrency} = </div>
                                <Field
                                    name="rate"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    style={{width: '110px', margin: '0 10px'}}
                                    fullWidth={true}
                                />
                                <div>{currency}</div>
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

SetCurrencyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    currencyData: PropTypes.object.isRequired,
    currentCurrency: PropTypes.string
}

SetCurrencyDialog.defaultProps = {
    isUpdate: false
}

export default SetCurrencyDialog
