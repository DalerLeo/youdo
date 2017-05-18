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
import Edit from 'material-ui/svg-icons/image/edit'
import Person from '../Images/person.png'

import ManufactureShiftCreateForm from './ManufactureShiftCreateForm'
import ManufactureStafCreateForm from './ManufactureStafCreateForm'

export const MANUFACTURE_ADD_STAFF_DIALOG_OPEN = 'addStaff'

const colorBlue = '#129fdd !important'
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
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            minHeight: '300px !important'
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
            minHeight: '184px',
            overflow: 'auto',
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
        },
        leftSide: {
            maxWidth: '40%',
            flexBasis: '40%',
            padding: '20px 30px'
        },
        rightSide: {
            maxWidth: '60%',
            flexBasis: '60%',
            borderLeft: '1px solid #efefef',
            padding: '20px 30px'
        },
        innerTitle: {
            margin: '20px 0 10px'
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
        },
        imageUpload: {
            width: '100px'
        },
        buttonSub: {
            textAlign: 'right',
            marginTop: '10px',
            '& span': {
                fontSize: '13px !important',
                color: colorBlue,
                padding: '0 10px'
            }
        },
        shift: {
            padding: '15px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            '& h4': {
                margin: '0',
                fontSize: '13px',
                fontWeight: '600'
            },
            '& span': {
                marginLeft: '5px',
                color: '#999',
                fontSize: '10px !important',
                fontWeight: '400'
            },
            '&:hover': {
                '& > div:last-child': {
                    display: 'flex'
                }
            }
        },
        deleteHideIco: {
            display: 'none',
            position: 'absolute',
            right: '0',
            alignItems: 'center'
        },
        background: {
            background: '#f1f5f8',
            color: '#333',
            margin: '10px -30px 0',
            padding: '10px 30px 10px'
        },
        staffAdd: {
            background: '#f1f5f8',
            color: '#333',
            margin: '10px -30px 0',
            padding: '10px 30px'
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
                    display: 'none'
                },
                '&:hover': {
                    '& div:last-child': {
                        display: 'flex'
                    }
                }
            }
        }
    }),
    reduxForm({
        form: 'ProviderCreateForm',
        enableReinitialize: true
    })
)

const iconStyle = {
    icon: {
        color: '#999',
        width: 16,
        height: 16
    },
    button: {
        width: 24,
        height: 24,
        padding: 0
    }
}

const ManufactureAddStaffDialog = enhance((props) => {
    const {
        open,
        loading,
        onClose,
        classes,
        stafData,
        shiftData,
        confirmDialog
    } = props

    const shiftList = _.map(_.get(shiftData, 'shiftList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const beginTime = _.get(item, 'beginTime')
        const endTime = _.get(item, 'endTime')

        return (
            <div key={id} className={classes.shift}>
                <h4>
                    {name}
                    <span>({beginTime} - {endTime})</span>
                </h4>
                <div className={classes.deleteHideIco}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        disableTouchRipple={true}
                        style={iconStyle.button}
                        onTouchTap={() => { shiftData.handleUpdateShiftForm(id) }}>
                        <Edit/>
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        disableTouchRipple={true}
                        style={iconStyle.button}
                        onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
            </div>
        )
    })

    const stafList = _.map(_.get(shiftData, 'shiftList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const beginTime = _.get(item, 'beginTime')
        const endTime = _.get(item, 'endTime')

        return (
            <div key={id} className={classes.shift}>
                <h4>
                    {name}
                    <span>({beginTime} - {endTime})</span>
                </h4>
                <div className={classes.deleteHideIco}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        disableTouchRipple={true}
                        style={iconStyle.button}
                        onTouchTap={() => { shiftData.handleUpdateShiftForm(id) }}>
                        <Edit/>
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        disableTouchRipple={true}
                        style={iconStyle.button}
                        onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
            </div>
        )
    })
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '700px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Производство клея: персонал</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div className={classes.leftSide}>
                        <div className={classes.innerTitle}>
                            <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0'}}>Смена</h3>
                            <a style={{float: 'right'}}
                               onClick={() => { shiftData.handleOpenAddShiftForm(!_.get(shiftData, 'openAddShiftForm')) }}>
                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                добавить
                            </a>
                        </div>
                        {_.get(shiftData, 'openAddShiftForm') && <div className={classes.background}>
                            <ManufactureShiftCreateForm
                                initialValues={shiftData.initialValues}
                                onSubmit={shiftData.handleSubmitShiftAddForm}/>
                        </div>}
                        {shiftList}
                    </div>
                    <div className={classes.rightSide}>
                        <div className={classes.innerTitle}>
                            <h3 style={{display: 'inline-block', fontSize: '13px', fontWeight: '600', margin: '0'}}>Персонал</h3>
                            <a style={{float: 'right'}}
                               onClick={() => { stafData.handleOpenAddStafForm(!_.get(stafData, 'openAddStafForm')) }}>
                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                добавить
                            </a>
                        </div>
                        {_.get(stafData, 'openAddStafForm') && <div className={classes.staffAdd}>
                            <ManufactureStafCreateForm
                                initialValues={shiftData.initialValues}
                                onSubmit={shiftData.handleSubmitStafAddForm}/>
                        </div>}
                        {stafList}
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
                                        <IconButton
                                            iconStyle={iconStyle.icon}
                                            disableTouchRipple={true}
                                            style={iconStyle.button}>
                                            <DeleteIcon/>
                                        </IconButton>
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
                                        <IconButton
                                            iconStyle={iconStyle.icon}
                                            disableTouchRipple={true}
                                            style={iconStyle.button}>
                                            <DeleteIcon/>
                                        </IconButton>
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
    loading: PropTypes.bool,
    shiftData: PropTypes.shape({
        openAddShiftForm: PropTypes.bool.isRequired,
        shiftList: PropTypes.array,
        handleSubmitShiftAddForm: PropTypes.func.isRequired,
        handleUpdateShiftForm: PropTypes.func.isRequired
    }),
    stafData: PropTypes.shape({
        openAddStafForm: PropTypes.bool.isRequired,
        handleOpenAddStafForm: PropTypes.bool.isRequired,
        stafList: PropTypes.array,
        handleSubmitStafAddForm: PropTypes.func.isRequired,
        handleUpdateStafForm: PropTypes.func.isRequired
    }),
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired
}

ManufactureAddStaffDialog.defaultProps = {
    isUpdate: false
}

export default ManufactureAddStaffDialog
