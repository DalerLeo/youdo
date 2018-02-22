import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {ManufactureSearchField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import t from '../../helpers/translate'
import {openErrorAction} from '../../actions/error'

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
            display: 'none'
        },

        body: {
            minHeight: 'auto'
        },
        form: {
            minHeight: 'auto'
        }
    })),
    reduxForm({
        form: 'InventoryVerifyForm',
        enableReinitialize: true
    })
)

const InventoryVerifyDialog = enhance((props) => {
    const {open, loading, dispatch, handleSubmit, onClose, classes} = props
    const validate = (error) => {
        const errors = toCamelCase(error)
        const nonFieldErrors = _.get(errors, 'nonFieldErrors')
        if (!_.isEmpty(nonFieldErrors)) {
            return dispatch(openErrorAction({
                message: nonFieldErrors
            }))
        }

        throw new SubmissionError({
            ...errors,
            _error: nonFieldErrors
        })
    }
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{t('Подтверждения сверки')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent} style={{minHeight: '100px'}}>
                        <div className={classes.field} style={{paddingTop: '15px'}}>
                            <Field
                                name="manufacture"
                                component={ManufactureSearchField}
                                className={classes.inputFieldCustom}
                                label={t('Производство')}
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Подтвердить')}
                            labelStyle={{fontSize: '13px'}}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

InventoryVerifyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default InventoryVerifyDialog
