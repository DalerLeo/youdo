import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import Search from 'material-ui/svg-icons/action/search'
import PositionCreateDialog from './PositionCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import Container from '../Container'
import Tooltip from '../ToolTip'
import {Pagination, TextField} from '../ReduxForm'
import SettingSideMenu from '../Setting/SettingSideMenu'
import EditIcon from 'material-ui/svg-icons/image/edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import {Field, reduxForm} from 'redux-form'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        addButton: {
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
        },
        wrapper: {
            display: 'flex',
            margin: '0 -28px',
            height: 'calc(100% + 28px)'
        },
        addButtonWrapper: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-18px'
        },
        semibold: {
            fontWeight: '600'
        },
        editContent: {
            width: '100%',
            backgroundColor: '#fff',
            color: '#333',
            padding: '20px 30px',
            boxSizing: 'border-box',
            marginBottom: '15px',
            '&>div': {
                marginBottom: '10px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        btnSend: {
            color: '#12aaeb !important'
        },
        btnAdd: {
            color: '#8acb8d !important'
        },
        btnRemove: {
            color: '#e57373 !important'
        },
        rightPanel: {
            flexBasis: 'calc(100% - 226px)',
            maxWidth: 'calc(100% - 226px)',
            background: '#fff',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '20px 30px'
        },
        nav: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 'solid 1px #efefef'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '40px !important',
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
        search: {
            display: 'flex',
            alignItems: 'center',
            width: '220px'
        },
        headers: {
            fontWeight: '600',
            '& > div': {
                padding: '15px 0',
                '&:after': {
                    margin: '0 8px'
                }
            }
        },
        permission: {
            '& span': {
                padding: '5px 10px',
                backgroundColor: '#e9ecef',
                margin: '0 5px'
            }
        },
        iconBtn: {
            display: 'flex',
            opacity: '0'
        },
        list: {
            '& .dottedList': {
                '&:hover > div:last-child > div': {
                    opacity: '1'
                }
            }
        }
    }),

    reduxForm({
        form: 'PositionPermissionForm'
    })
)
const MINUS_ONE = -1

const iconSearchStyle = {
    icon: {
        color: '#333',
        width: 25,
        height: 25
    },
    button: {
        width: 40,
        height: 40,
        padding: 0
    }
}

const iconStyle = {
    icon: {
        color: '#666',
        width: 25,
        height: 25
    },
    button: {
        width: 25,
        height: 25,
        padding: 0
    }
}

const PositionGridList = enhance((props) => {
    const {
        createDialog,
        updateDialog,
        confirmDialog,
        listData,
        classes,
        detailId,
        filter
    } = props

/*    Const positionList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const isActive = _.get(detailData, 'id') === id

        if (name) {
            return (
                <div key={id} className={classes.list}
                     style={isActive ? {backgroundColor: '#ffffff', display: 'relative'}
                         : {backgroundColor: '#f2f5f8', display: 'relative'}}
                     onClick={() => {
                         listData.handlePositionClick(id)
                     }}>
                    <div className={classes.title}>{name}</div>
                </div>
            )
        }
        return null
    }) */

    const role = {
        data: [
            {
                name: 'naimenivaniya1',
                id: 1,
                codeName: 'naimen',
                createdDate: '21-08-2017',
                permissions: [
                    {
                        name: 'sup'
                    },
                    {
                        name: 'merch'
                    },
                    {
                        name: 'supDir'
                    }
                ]
            },

            {
                name: 'naimenivaniya2',
                codeName: 'naimen',
                id: 2,
                createdDate: '22-08-2017',
                permissions: [
                    {
                        name: 'merch'
                    },
                    {
                        name: 'supDir'
                    }
                ]
            },
            {
                name: 'naimenivaniya3',
                codeName: 'naimen',
                id: 3,
                createdDate: '23-08-2017',
                permissions: [
                    {
                        name: 'sup'
                    },
                    {
                        name: 'merch'
                    }
                ]
            }

        ]

    }

    const headers = (
        <Row className="dottedList">
            <Col xs={2}>Должность</Col>
            <Col xs={9}>Права доступа</Col>
            <Col xs={1}></Col>
        </Row>
    )
    const permissionList = _.map(_.get(role, ['data']), (item, index) => {
        const name = _.get(item, 'name')
        const id = _.get(item, 'id')
        return (
            <Row key={index} className="dottedList">
                <Col xs={2}>
                    {name}
                </Col>
                <Col xs={9}>
                    <div className={classes.permission}>
                    {_.map(_.get(item, ['permissions']), (perm) => {
                        const permName = _.get(perm, 'name')

                        return (
                            <span key={permName}>{permName}</span>
                        )
                    })}
                    </div>
                </Col>
                <Col xs={1}>
                    <div className={classes.iconBtn}>
                        <Tooltip position="bottom" text="Распечатать накладную">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                touch={true}
                                onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Изменить">
                            <IconButton
                                disableTouchRipple={true}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                touch={true}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const confirmMessage = 'Валюта: ' + _.get(currentDetail, 'name')

    const search = (
        <form className={classes.search}>
            <Field
                className={classes.inputFieldCustom}
                name="search"
                fullWidth={true}
                component={TextField}
                hintText="Товар"/>
            <IconButton
                iconStyle={iconSearchStyle.icon}
                style={iconSearchStyle.button}
                type="submit">
                <Search/>
            </IconButton>
        </form>
    )
    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.POSITION_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <div className={classes.nav}>
                        <div>
                            <FlatButton
                            label="+ создать должность"
                            className={classes.btnSend}
                            primary={true}
                            />
                        </div>
                        <div>{search}</div>
                        <Pagination filter={filter}/>

                    </div>
                    <div className={classes.headers}>{headers}</div>
                    <div className={classes.list}>{permissionList}</div>
                </div>
                <PositionCreateDialog
                    initialValues={createDialog.initialValues}
                    open={createDialog.openCreateDialog}
                    loading={createDialog.createLoading}
                    onClose={createDialog.handleCloseCreateDialog}
                    onSubmit={createDialog.handleSubmitCreateDialog}
                />

                <PositionCreateDialog
                    isUpdate={true}
                    initialValues={updateDialog.initialValues}
                    open={updateDialog.openUpdateDialog}
                    loading={updateDialog.updateLoading}
                    onClose={updateDialog.handleCloseUpdateDialog}
                    onSubmit={updateDialog.handleSubmitUpdateDialog}
                />
                {detailId !== MINUS_ONE && <ConfirmDialog
                    type="delete"
                    message={confirmMessage}
                    onClose={confirmDialog.handleCloseConfirmDialog}
                    onSubmit={confirmDialog.handleSendConfirmDialog}
                    open={confirmDialog.openConfirmDialog}
                />}
            </div>
        </Container>
    )
})

PositionGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    setPositionUpdateDialog: PropTypes.shape({
        setPositionLoading: PropTypes.bool.isRequired,
        openSetPositionDialog: PropTypes.bool.isRequired,
        handleOpenSetPositionDialog: PropTypes.func.isRequired,
        handleCloseSetPositionDialog: PropTypes.func.isRequired,
        handleSubmitSetPositionDialog: PropTypes.func.isRequired
    }),
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    actionsDialog: PropTypes.shape({
        handleActionEdit: PropTypes.func.isRequired,
        handleActionDelete: PropTypes.func.isRequired
    }).isRequired
}

export default PositionGridList
