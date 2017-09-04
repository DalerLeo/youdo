import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import PositionCreateDialog from './PositionCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import Container from '../Container'
import Tooltip from '../ToolTip'
import {Pagination} from '../ReduxForm'
import SettingSideMenu from '../Setting/SettingSideMenu'
import EditIcon from 'material-ui/svg-icons/image/edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import {reduxForm} from 'redux-form'
import ContentAdd from 'material-ui/svg-icons/content/add'
import CircularProgress from 'material-ui/CircularProgress'
import userGroupFormat from '../../helpers/userGroupFormat'
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '30%',
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
            padding: '10px 30px 20px'
        },
        nav: {
            display: 'flex',
            height: '50px',
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
                height: '50px',
                '&:after': {
                    margin: '0 8px'
                }
            }
        },
        permission: {
            '& > span': {
                padding: '0 10px',
                height: '28px',
                borderRadius: '2px',
                lineHeight: '1',
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#e9ecef',
                marginRight: '10px'
            }
        },
        iconBtn: {
            display: 'flex',
            opacity: '0',
            transition: 'all 200ms ease-out'
        },
        list: {
            '& .dottedList': {
                height: '50px',
                '&:after': {
                    margin: '0 8px'
                },
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

const iconStyle = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 25,
        padding: 0
    }
}
const accessList = [
    {
        id: 2,
        name: 'delivery'
    },
    {
        id: 1,
        name: 'SupDir'
    },
    {
        id: 3,
        name: 'agent'
    },
    {
        id: 4,
        name: 'merch'
    },
    {
        id: 5,
        name: 'collector'
    },
    {
        id: 6,
        name: 'cashier'
    },
    {
        id: 7,
        name: 'supervisor'
    },
    {
        id: 8,
        name: 'changePrice'
    },
    {
        id: 9,
        name: 'changeRate'
    }
]
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
    const loading = _.get(listData, 'listLoading')

    const headers = (
        <Row className="dottedList">
            <Col xs={2}>Должность</Col>
            <Col xs={9}>Права доступа</Col>
            <Col xs={1}></Col>
        </Row>
    )
    const permissionList = _.map(_.get(listData, ['data']), (item, index) => {
        const name = _.get(item, 'name')
        const id = _.get(item, 'id')
        return (
            <Row key={index} className="dottedList">
                <Col xs={2}>
                    {name}
                </Col>
                <Col xs={9}>
                    <div className={classes.permission}>
                        {_.map(_.get(item, ['groups']), (perm) => {
                            const access = _.find(accessList, {'id': _.toInteger(perm)})
                            if (_.get(access, 'id') !== MINUS_ONE) {
                                return (
                                    <span key={perm}>{userGroupFormat(_.get(access, 'name'))}</span>
                                )
                            }
                            return (
                                <span key={perm}>Нет доступа</span>
                            )
                        })}
                    </div>
                </Col>
                <Col xs={1}>
                    <div className={classes.iconBtn}>
                        <Tooltip position="bottom" text="Изменить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                touch={true}
                                onTouchTap={() => {
                                    updateDialog.handleOpenUpdateDialog(id)
                                }}>
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip position="bottom" text="Удалить">
                            <IconButton
                                disableTouchRipple={true}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                onTouchTap={() => {
                                    confirmDialog.handleOpenConfirmDialog()
                                }}
                                touch={true}>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const confirmMessage = 'Валюта: ' + _.get(currentDetail, 'name')
    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.POSITION_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <div className={classes.nav}>
                        <div>
                            <FlatButton
                                label="создать должность"
                                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb', fontSize: '13px'}}
                                className={classes.addButton}
                                onTouchTap={createDialog.handleOpenCreateDialog}
                                icon={<ContentAdd color="#12aaeb"/>}
                                primary={true}
                            />
                        </div>
                        <Pagination filter={filter}/>

                    </div>
                    <div className={classes.headers}>{headers}</div>
                    {loading
                        ? <div className={classes.loader}><CircularProgress size={60} thickness={4}/></div>
                        : <div className={classes.list}>{permissionList}</div>}
                </div>
                <PositionCreateDialog
                    initialValues={createDialog.initialValues}
                    data={_.get(createDialog, ['permissionList', 'results'])}
                    open={createDialog.openCreateDialog}
                    loading={createDialog.createLoading}
                    dataLoading={_.get(createDialog, 'permissionLoading')}
                    onClose={createDialog.handleCloseCreateDialog}
                    onSubmit={createDialog.handleSubmitCreateDialog}
                />

                <PositionCreateDialog
                    isUpdate={true}
                    initialValues={updateDialog.initialValues}
                    dataLoading={_.get(createDialog, 'permissionLoading')}
                    data={_.get(createDialog, ['permissionList', 'results'])}
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
