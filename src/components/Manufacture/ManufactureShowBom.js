import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Col} from 'react-flexbox-grid'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
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
import ImageCheck from '../Icons/check'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

export const MANUFACTURE_SHOW_BOM_DIALOG_OPEN = 'showBom'

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
            '& .dottedList input': {
                fontSize: '13px !important'
            },
            '& .dottedList:last-child': {
                marginBottom: '20px'
            }
        },
        addMaterials: {
            background: 'rgb(242, 245, 248)',
            margin: '10px -30px',
            padding: '10px 23px',
            display: 'flex',
            '& input': {
                fontSize: '13px !important',
                marginTop: '5px !important'
            },
            '& label': {
                fontSize: '13px !important',
                top: '20px !important'
            },
            '& div div:first-child': {
                height: '50px !important'
            }
        }
    })),
    withState('openAddMaterials', 'setOpenAddMaterials', false),
    reduxForm({
        form: 'ProviderCreateForm',
        enableReinitialize: true
    })
)

const ManufactureShowBom = enhance((props) => {
    const {open, loading, onClose, classes, openAddMaterials, setOpenAddMaterials} = props

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
            contentStyle={loading ? {width: '135px'} : {width: '600px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>BoM</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div style={{width: '100%'}}>
                        <div className={classes.titleBom}>
                            <span>Продукт: <strong>Клей для скотча</strong></span><br />
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </div>
                        <div className={classes.titleAdd}>
                            <h3>Сырье</h3>
                            <a onClick={() => { setOpenAddMaterials(!openAddMaterials) }}>
                                <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}} viewBox="0 0 24 15" />
                                добавить сырье
                            </a>
                        </div>
                        {openAddMaterials && <div className={classes.addMaterials}>
                            <Col xs={8}>
                                <Field
                                    name="nameAdd"
                                    component={TextField}
                                    className={classes.inputFieldMaterials}
                                    label="Наименование"
                                    fullWidth={true}/>
                            </Col>
                            <Col xs={2}>
                                <Field
                                    name="countAdd"
                                    component={TextField}
                                    className={classes.inputFieldMaterials}
                                    label="Кол-во"
                                    fullWidth={true}/>
                            </Col>
                            <Col xs={1}>
                                <Field
                                    name="edAdd"
                                    component={TextField}
                                    className={classes.inputFieldMaterials}
                                    label="Ед."
                                    fullWidth={true}/>
                            </Col>
                            <Col xs={1}>
                                <IconButton>
                                    <div>
                                        <ImageCheck style={{color: '#129fdd'}} />
                                    </div>
                                </IconButton>
                            </Col>
                        </div>}
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
                            <li className="dottedList" style={{margin: '0 -29px', padding: '10px 30px', background: '#f2f5f8'}}>
                                <Col xs={8}>
                                    <Field
                                        name="name"
                                        defaultValue="Value on load"
                                        component={TextField}
                                        className={classes.inputFieldMaterials}
                                        fullWidth={true}/>
                                </Col>
                                <Col xs={2}>
                                    <Field
                                        name="count"
                                        component={TextField}
                                        className={classes.inputFieldMaterials}
                                        fullWidth={true}/>
                                </Col>
                                <Col xs={1}>
                                    <Field
                                        name="unit"
                                        component={TextField}
                                        className={classes.inputFieldMaterials}
                                        fullWidth={true}/>
                                </Col>
                                <Col xs={1}>
                                    <IconButton>
                                        <div>
                                            <ImageCheck style={{color: '#129fdd'}} />
                                        </div>
                                    </IconButton>
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
