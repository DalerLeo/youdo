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
import {TimeField, CheckBox} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import MainStyles from '../Styles/MainStyles'

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
        const setTime = _.get(state, ['form', 'SetDateDialogForm', 'values', 'setTime'])
        return {
            setTime
        }
    })
)

const SetDateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, setTime} = props
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
                <span>Время работы</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit}>
                    <div className={classes.inContent} style={{minHeight: '150px'}}>
                        <div className={classes.field} style={{paddingTop: '15px'}}>
                            <div className={classes.iconBtn}>
                                <Field
                                    name="setTime"
                                    className={classes.checkbox}
                                    component={CheckBox}
                                    label={'Время не ограничено'}/>
                            </div>
                            <Field
                                disabled={setTime}
                                name="fromTime"
                                component={TimeField}
                                className={classes.inputFieldTime}
                                value='asdasd'
                                label="Начало"
                                fullWidth={true}/>
                            <Field
                                disabled={setTime}
                                name="toTime"
                                component={TimeField}
                                className={classes.inputFieldTime}
                                label="Конец"
                                fullWidth={true}/>
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
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

SetDateDialog.defaultProps = {
    isUpdate: false
}

export default SetDateDialog
