import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, TimeField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import MainStyles from '../Styles/MainStyles'

export const SHIFT_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
        buttonSub: {
            textAlign: 'right',
            marginTop: '10px',
            '& span': {
                color: '#129fdd !important'
            }
        },
        timePick: {
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                flexBasis: '49%'
            }
        },
        inputFieldShift: {
            fontSize: '13px !important',
            marginRight: '20px',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        },
        inputFieldTime: {
            fontSize: '13px !important',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        }
    })),
    reduxForm({
        form: 'ShiftCreateForm',
        enableReinitialize: true
    })
)

const ShiftCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.body}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Редактирование смены' : 'Добавить смену'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit}>
                    <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    <div className={classes.inContent} style={{minHeight: '150px'}}>
                        <div className={classes.field} style={{paddingTop: '15px'}}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputFieldShift}
                                label="Наименование"
                                fullWidth={true}/>
                            <div className={classes.timePick}>
                                <Field
                                    name="beginTime"
                                    component={TimeField}
                                    className={classes.inputFieldTime}
                                    label="Начало"
                                    fullWidth={true}/>
                                <Field
                                    name="endTime"
                                    component={TimeField}
                                    className={classes.inputFieldTime}
                                    label="Конец"
                                    fullWidth={true}/>
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Применить"
                            className={classes.actionButton}
                            labelStyle={{fontSize: '13px'}}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

ShiftCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ShiftCreateDialog.defaultProps = {
    isUpdate: false
}

export default ShiftCreateDialog
