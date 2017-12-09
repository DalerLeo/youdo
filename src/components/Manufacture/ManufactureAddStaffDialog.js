import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {
    ShiftSearchField,
    UsersSearchField
} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'

export const OPEN_USER_CREATE_DIALOG = 'openCreateDialog'

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
    injectSheet({
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
        inputFieldCustom: {
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
                marginTop: '0 !important'
            }
        },
        popUp: {
            overflow: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            maxHeight: '50vh',
            minHeight: '140px',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            width: '100%'
        },
        inputField: {
            fontSize: '13px !important'
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        }
    }),
    reduxForm({
        form: 'ManufactureCreateUserForm',
        enableReinitialize: true
    })
)

const ManufactureAddStaffDialog = enhance((props) => {
    const {
        open,
        loading,
        onClose,
        isUpdate,
        handleSubmit,
        classes
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.titleContent}>
                    <span>Производство клея: персонал</span>
                    <IconButton onTouchTap={onClose}>
                        <CloseIcon color="#666666"/>
                    </IconButton>
                </div>
                <div className={classes.bodyContent}>
                    <div className={classes.inContent}>
                        <div style={{width: '100%', paddingTop: '10px'}}>
                            <Field
                                name="user"
                                component={UsersSearchField}
                                className={classes.inputFieldCustom}
                                disabled={isUpdate}
                                label="Сотрудник"
                                fullWidth={true}/>
                            <Field
                                name="shift"
                                component={ShiftSearchField}
                                className={classes.inputFieldCustom}
                                label="Смена"
                                fullWidth={true}/>
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
                </div>
            </form>
        </Dialog>
    )
})

ManufactureAddStaffDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

ManufactureAddStaffDialog.defaultProps = {
    isUpdate: false
}

export default ManufactureAddStaffDialog
