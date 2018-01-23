import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TimeField, PermissionTimeSearchField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import MainStyles from '../Styles/MainStyles'
import {
    ON_TIME,
    OFF_TIME
} from '../../constants/permissionTime'

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
        form: 'SetDateDialogForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const status = _.get(state, ['form', 'SetDateDialogForm', 'values', 'status', 'value'])
        return {
            status
        }
    })
)

const SetDateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, status} = props
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
                <span>{t('Время работы')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit}>
                        <div className={classes.inContent} style={{minHeight: '150px'}}>
                        <div className={classes.field} style={{paddingTop: '15px'}}>
                            <Field
                                name="status"
                                component={PermissionTimeSearchField}
                                className={classes.inputFieldTime}
                                label="Тип"
                                fullWidth={true}/>
                            <div style={(status === ON_TIME || status === OFF_TIME)
                                ? {display: 'flex', justifyContent: 'space-between'}
                                : {display: 'flex', justifyContent: 'space-between', visibility: 'hidden'}}>
                                <div style={{width: '48%'}}>
                                    <Field
                                        name="fromTime"
                                        component={TimeField}
                                        className={classes.inputFieldTime}
                                        label="Начало"
                                        fullWidth={true}/>
                                </div>
                                <div style={{width: '48%'}}>
                                    <Field
                                        name="toTime"
                                        component={TimeField}
                                        className={classes.inputFieldTime}
                                        label="Конец"
                                        fullWidth={true}/>
                                </div>
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

SetDateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default SetDateDialog
