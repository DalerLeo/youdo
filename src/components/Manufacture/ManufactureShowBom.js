import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Col} from 'react-flexbox-grid'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm} from 'redux-form'
import {TextField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import MainStyles from '../Styles/MainStyles'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui/svg-icons/image/edit'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

export const MANUFACTURE_SHOW_BOM_DIALOG_OPEN = 'showBom'

const colorBlue = '#129fdd !important'
const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
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
        body: {
            minHeight: '450px'
        },
        listBom: {
            margin: '0 30px',
            width: '100%'
        },
        titleBom: {
            padding: '20px 0',
            borderBottom: '1px solid #efefef',
            width: '100%'
        },
        titleAdd: {
            margin: '20px 0 5px',
            '& h3': {
                display: 'inline-block',
                fontSize: '13px',
                fontWeight: '800',
                margin: '0'
            },
            '& a': {
                float: 'right'
            }
        },

        modalListTable: {
            '& li': {
                margin: '0',
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '& div:first-child': {
                    paddingLeft: '0'
                },
                '& div:last-child': {
                    paddingRight: '0'
                }
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            },
            '& .dottedList:last-child': {
                marginBottom: '20px'
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

const ManufactureShowBom = enhance((props) => {
    const {open, loading, onClose, classes} = props

    const iconButton = (
        <IconButton style={{padding: '0 12px', height: 'auto'}}>
            <MoreVertIcon />
        </IconButton>
    )

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '600px'}}
            bodyClassName={classes.body}>

            <div className={classes.titleContent}>
                <span>BoM</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fieldsWrap}>
                    <div className={classes.listBom}>
                        <div className={classes.titleBom}>
                            <span>Продукт: <strong>Клей для скотча</strong></span><br />
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </div>
                        <div className={classes.titleAdd}>
                            <h3>Сырье</h3>
                            <a>
                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                добавить сырье
                            </a>
                        </div>
                        <ul className={classes.modalListTable}>
                            <li className="dottedList">
                                <Col xs={8}>
                                    <strong>Наименование</strong>
                                </Col>
                                <Col xs={2}>
                                    <strong>Кол-во</strong>
                                </Col>
                                <Col xs={1}>
                                    <strong>Ед.</strong>
                                </Col>
                                <Col xs={1}>
                                    &nbsp;
                                </Col>
                            </li>
                            <li className="dottedList">
                                <Col xs={8}>
                                    Дистилированная вода
                                </Col>
                                <Col xs={2}>
                                    100
                                </Col>
                                <Col xs={1}>
                                    л
                                </Col>
                                <Col xs={1}>
                                    <IconMenu
                                        iconButtonElement={iconButton}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                        <MenuItem
                                            primaryText="Изменить"
                                            leftIcon={<Edit />}
                                        />
                                        <MenuItem
                                            primaryText="Удалить "
                                            leftIcon={<DeleteIcon />}
                                        />
                                    </IconMenu>
                                </Col>
                            </li>
                            <li className="dottedList">
                                <Col xs={8}>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        className={classes.inputFieldShift}
                                        label="Сотрудник"
                                        fullWidth={true}/>
                                </Col>
                                <Col xs={2}>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        className={classes.inputFieldShift}
                                        label="Сотрудник"
                                        fullWidth={true}/>
                                </Col>
                                <Col xs={1}>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        className={classes.inputFieldShift}
                                        label="Сотрудник"
                                        fullWidth={true}/>
                                </Col>
                                <Col xs={1}>
                                    <IconMenu
                                        iconButtonElement={iconButton}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                        <MenuItem
                                            primaryText="Изменить"
                                            leftIcon={<Edit />}
                                        />
                                        <MenuItem
                                            primaryText="Удалить "
                                            leftIcon={<DeleteIcon />}
                                        />
                                    </IconMenu>
                                </Col>
                            </li>
                            <li className="dottedList">
                                <Col xs={8}>
                                    Дистилированная вода
                                </Col>
                                <Col xs={2}>
                                    100
                                </Col>
                                <Col xs={1}>
                                    л
                                </Col>
                                <Col xs={1}>
                                    <IconMenu
                                        iconButtonElement={iconButton}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                        <MenuItem
                                            primaryText="Изменить"
                                            leftIcon={<Edit />}
                                        />
                                        <MenuItem
                                            primaryText="Удалить "
                                            leftIcon={<DeleteIcon />}
                                        />
                                    </IconMenu>
                                </Col>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={classes.bottomButton}>
                <FlatButton
                    label="Сохранить"
                    className={classes.actionButton}
                    type="submit"
                />
            </div>
        </Dialog>
    )
})

ManufactureShowBom.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool
}

ManufactureShowBom.defaultProps = {
    isUpdate: false
}

export default ManufactureShowBom
