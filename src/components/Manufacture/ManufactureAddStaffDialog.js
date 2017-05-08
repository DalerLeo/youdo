import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import {TextField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import MainStyles from '../Styles/MainStyles'
import Person from '../Images/person.png'

export const MANUFACTURE_ADD_STAFF_DIALOG_OPEN = 'addStaff'

const colorBlue = '#129fdd !important'
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
        leftSide: {
            width: '40%',
            paddingRight: '20px',
            height: '100%'
        },
        rightSide: {
            width: '60%',
            borderLeft: '1px solid #efefef',
            padding: '0 0 20px 20px',
            height: '100%'
        },
        innerTitle: {
            marginTop: '20px'
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
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '& div:first-child': {
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    borderRadius: '50%',
                    verticalAlign: 'top',
                    marginRight: '10px',
                    overflow: 'hidden'
                },
                '& div:first-child img': {
                    width: '30px'
                },
                '& div:nth-child(2)': {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    width: '80%'
                },
                '& div::nth-child(2) span': {
                    color: '#666'
                },
                '& div:last-child': {
                    top: '0px !important',
                    display: 'none'
                },
                '&:hover': {
                    '& div:last-child': {
                        display: 'flex'
                    }
                }
            }
        }
    })),
    withState('openAddShift', 'setOpenAddShift', false),
    withState('openAddStaff', 'setOpenAddStaff', false),
    reduxForm({
        form: 'ProviderCreateForm',
        enableReinitialize: true
    })
)

const ManufactureAddStaffDialog = enhance((props) => {
    const {open, loading, onClose, classes, openAddShift, setOpenAddShift, openAddStaff, setOpenAddStaff} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '600px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>ПРОИЗВОДСТВО КЛЕЯ: ПЕРСОНАЛ</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div className={classes.leftSide}>
                        <div className={classes.innerTitle}>
                            <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0'}}>Смена</h3>
                            <a style={{float: 'right'}} onClick={() => { setOpenAddShift(!openAddShift) }}>
                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                добавить
                            </a>
                        </div>
                        {openAddShift && <div className={classes.background}>
                            <form>
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
                                        type="submit"
                                    />
                                </div>
                            </form>
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
                            <form>
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
                                        label="Применить"
                                        className={classes.actionButton}
                                        type="submit"
                                    />
                                </div>
                            </form>
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
                                        <img src={Person} />
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
                                        <img src={Person} />
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
                                        <img src={Person} />
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
                                        <img src={Person} />
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
