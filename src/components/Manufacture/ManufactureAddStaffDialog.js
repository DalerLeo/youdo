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
import ContentAdd from 'material-ui/svg-icons/content/add'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

export const MANUFACTURE_ADD_STAFF_DIALOG_OPEN = 'addStaff'

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

const colorBlue = '#129fdd !important'
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
        fieldsWrap: {
            display: ({loading}) => !loading ? 'flex' : 'none',
            width: '100%',
            fontSize: '13px'
        },
        leftSide: {
            width: '40%'
        },
        rightSide: {
            width: '60%'
        },
        body: {
            overflowY: 'auto !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '20px !important'
        },
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: '#333'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                position: 'absolute !important',
                right: '10px',
                top: '50%',
                padding: '0 !important',
                marginTop: '-24px !important'
            }
        },
        form: {
            display: 'flex',
            padding: '35px 10px 76px'
        },
        inputFieldShift: {
            fontSize: '13px !important',
            width: '55% !important',
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
            width: 'calc(45% - 20px) !important',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        },
        imageUpload: {
            width: '100px'
        },
        bottomButton: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '20px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: colorBlue
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        buttonSub: {
            textAlign: 'right',
            marginTop: '10px',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: colorBlue,
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            '& button': {
                margin: '0 !important',
                fontSize: '13px !important',
                marginRight: '-20px !important'
            }
        },
        shift: {
            padding: '20px 0 0',
            '& h4': {
                margin: '0',
                fontSize: '13px',
                fontWeight: '600'
            },
            '& span': {
                marginLeft: '5px',
                color: '#999',
                fontSize: '11px',
                fontWeight: '100'
            }
        },
        deleteHideIco: {
            position: 'relative',
            display: 'table-cell',
            float: 'right',
            top: '-15px',
            cursor: 'pointer'
        },
        background: {
            background: '#f1f5f8',
            color: '#333',
            margin: '0 -30px 0',
            padding: '20px 30px 10px'
        }
    }),
    reduxForm({
        form: 'ProviderCreateForm',
        enableReinitialize: true
    })
)

const ManufactureAddStaffDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '570px'}}
            bodyClassName={classes.body}>

            <div className={classes.titleContent}>
                <span>ПРОИЗВОДСТВО КЛЕЯ: ПЕРСОНАЛ</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fieldsWrap}>
                    <div className={classes.leftSide}>
                        <div>
                            <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0'}}>Персонал</h3>
                            <a style={{float: 'right'}}>
                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                добавить
                            </a>
                        </div>
                        <div className={classes.background}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputFieldShift}
                                label="Наименование"
                                fullWidth={true}/>
                            <Field
                                name="address"
                                component={TextField}
                                className={classes.inputFieldTime}
                                label="Время"
                                fullWidth={true}/>
                            <div className={classes.buttonSub}>
                                <FlatButton
                                    label="Сохранить"
                                    className={classes.actionButton}
                                    primary={true}
                                    type="submit"
                                />
                            </div>
                        </div>
                        <div className={classes.shift}>
                            <h4>
                                Смена А
                                <span>(00:00 - 00:00)</span>
                            </h4>
                            <div className={classes.deleteHideIco}>
                                <DeleteIcon style={{width: '16px', height: '16px', color: '#999'}}/>
                            </div>
                        </div>
                        <div className={classes.shift}>
                            <h4>
                                Смена Б
                                <span>(00:00 - 00:00)</span>
                            </h4>
                            <div className={classes.deleteHideIco}>
                                <DeleteIcon style={{width: '16px', height: '16px', color: '#999'}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className={classes.bottomButton}>
                <FlatButton
                    label="Сохранить"
                    className={classes.actionButton}
                    primary={true}
                    type="submit"
                    keyboardFocused={true}
                />
            </div>
        </Dialog>
    )
})

ManufactureAddStaffDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool
}

ManufactureAddStaffDialog.defaultProps = {
    isUpdate: false
}

export default ManufactureAddStaffDialog
