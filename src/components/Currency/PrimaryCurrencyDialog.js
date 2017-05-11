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
import {CurrencySearchField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const PRIMARY_CURRENCY_DIALOG_OPEN = 'openPrimaryDialog'

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

        fields: {
            display: ({loading}) => !loading ? 'flex' : 'none'
        }
    })),
    reduxForm({
        form: 'BaseCurrencyCreateForm',
        enableReinitialize: true
    })
)

const PrimaryCurrencyDialog = enhance((props) => {
    const {classes, open, onClose, handleSubmit, loading} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '200px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Выбрать основную валюту</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.fields}>
                            <Field
                                name="currency"
                                component={CurrencySearchField}
                                className={classes.inputField}
                                label="Валюта"
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

PrimaryCurrencyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired
}

PrimaryCurrencyDialog.defaultProps = {
    isUpdate: false
}

export default PrimaryCurrencyDialog
