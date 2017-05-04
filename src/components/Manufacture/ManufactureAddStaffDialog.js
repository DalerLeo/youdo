import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
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
            fontSize: '13px',
            minHeight: '235px'
        },
        leftSide: {
            width: '40%',
            paddingRight: '20px'
        },
        rightSide: {
            width: '60%',
            minHeight: '235px',
            borderLeft: '1px solid #efefef',
            paddingLeft: '20px'
        },
        innerTitle: {
            marginTop: '20px'
        },
        body: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            minHeight: '428px',
            maxHeight: 'calc(100vh - 200px) !important'
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
            top: '0',
            left: '0',
            right: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                marginTop: '-17px !important',
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        form: {
            display: 'flex',
            padding: '0 30px',
            minHeight: '307px',
            maxHeight: '50vh',
            overflow: 'auto'
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
            bottom: '0',
            left: '0',
            right: '0',
            padding: '15px',
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
            },
            '&:hover': {
                '& div:last-child': {
                    display: 'table-cell'
                }
            }
        },
        deleteHideIco: {
            position: 'relative',
            display: 'none',
            float: 'right',
            top: '-15px',
            cursor: 'pointer'
        },
        background: {
            background: '#f1f5f8',
            color: '#333',
            margin: '10px -20px 0 -30px',
            padding: '10px 20px 5px 30px'
        },
        staffAdd: {
            background: '#f1f5f8',
            color: '#333',
            margin: '10px -30px 0 -20px',
            padding: '10px 30px 5px 20px'
        },
        personalList: {
            '& ul': {
                listStyle: 'none',
                margin: '0',
                padding: '0',
                '& li:last-child': {
                    border: 'none'
                }
            },
            '& li': {
                margin: '0',
                borderBottom: '1px dashed #efefef',
                padding: '10px 0',
                '& div:first-child': {
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    borderRadius: '50%',
                    verticalAlign: 'top',
                    marginRight: '10px'
                },
                '& div:first-child img': {
                    width: '30px'
                },
                '& div:nth-child(2)': {
                    display: 'inline-block',
                    verticalAlign: 'top'
                },
                '& div::nth-child(2) span': {
                    color: '#666'
                },
                '& div:last-child': {
                    top: '6px !important',
                    display: 'none'
                },
                '&:hover': {
                    '& div:last-child': {
                        display: 'block'
                    }
                }
            }
        }
    }),
    withState('openAddShift', 'setOpenAddShift', false),
    withState('openAddStaff', 'setOpenAddStaff', false),
    reduxForm({
        form: 'ProviderCreateForm',
        enableReinitialize: true
    })
)

const ManufactureAddStaffDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, openAddShift, setOpenAddShift, openAddStaff, setOpenAddStaff} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '600px'}}
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
                        <div className={classes.innerTitle}>
                            <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0'}}>Смена</h3>
                            <a style={{float: 'right'}} onClick={() => { setOpenAddShift(!openAddShift) }}>
                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                добавить
                            </a>
                        </div>
                        {openAddShift && <div className={classes.background}>
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
                        </div>}
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
                    <div className={classes.rightSide}>
                        <div className={classes.innerTitle}>
                            <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0'}}>Персонал</h3>
                            <a style={{float: 'right'}} onClick={() => { setOpenAddStaff(!openAddStaff) }}>
                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                добавить
                            </a>
                        </div>
                        {openAddStaff && <div className={classes.staffAdd}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputFieldShift}
                                label="Сотрудник"
                                fullWidth={true}/>
                            <Field
                                name="address"
                                component={TextField}
                                className={classes.inputFieldTime}
                                label="Смена"
                                fullWidth={true}/>
                            <div className={classes.buttonSub}>
                                <FlatButton
                                    label="Сохранить"
                                    className={classes.actionButton}
                                    primary={true}
                                    type="submit"
                                />
                            </div>
                        </div>}
                        <div className={classes.personalList}>
                            <div className={classes.shift}>
                                <h4>
                                    Смена Б
                                    <span>(00:00 - 00:00)</span>
                                </h4>
                            </div>
                            <ul>
                                <li>
                                    <div>
                                        <img src />
                                    </div>
                                    <div>
                                        Атамбаев Бекзод<br />
                                        <span>Должность</span>
                                    </div>
                                    <div className={classes.deleteHideIco}>
                                        <DeleteIcon style={{width: '16px', height: '16px', color: '#999'}}/>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <img src />
                                    </div>
                                    <div>
                                        Атамбаев Бекзод<br />
                                        <span>Должность</span>
                                    </div>
                                    <div className={classes.deleteHideIco}>
                                        <DeleteIcon style={{width: '16px', height: '16px', color: '#999'}}/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={classes.personalList}>
                            <div className={classes.shift}>
                                <h4>
                                    Смена Б
                                    <span>(00:00 - 00:00)</span>
                                </h4>
                            </div>
                            <ul>
                                <li>
                                    <div>
                                        <img src />
                                    </div>
                                    <div>
                                        Атамбаев Бекзод<br />
                                        <span>Должность</span>
                                    </div>
                                    <div className={classes.deleteHideIco}>
                                        <DeleteIcon style={{width: '16px', height: '16px', color: '#999'}}/>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <img src />
                                    </div>
                                    <div>
                                        Атамбаев Бекзод<br />
                                        <span>Должность</span>
                                    </div>
                                    <div className={classes.deleteHideIco}>
                                        <DeleteIcon style={{width: '16px', height: '16px', color: '#999'}}/>
                                    </div>
                                </li>
                            </ul>
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
