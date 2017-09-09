import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import PermissionCreateDialog from './PermissionCreateDialog'
import PermissionToggle from './PermissionToggle'
import ConfirmDialog from '../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import SettingSideMenu from '../Setting/SettingSideMenu'
import SetDateDialog from './SetDateDialog'
import Tooltip from '../Tooltip'
import toBoolean from '../../helpers/toBoolean'
import {Field, reduxForm} from 'redux-form'

const listHeader = [
    {
        sorting: false,
        name: 'name',
        xs: 4,
        title: 'Наименование'
    },
    {
        sorting: false,
        name: 'fromTime',
        xs: 2,
        title: 'Время начала'
    },
    {
        sorting: false,
        name: 'toTime',
        xs: 2,
        title: 'Время окончания'
    },
    {
        sorting: false,
        xs: 2,
        alignRight: true,
        name: 'actions',
        title: 'Статус'
    },
    {
        sorting: false,
        name: 'edit',
        alignRight: true,
        xs: 2,
        title: 'Edit'
    }
]

const enhance = compose(
    injectSheet({
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
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '10px',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        verticalButton: {
            border: '2px #dfdfdf solid !important',
            borderRadius: '50%',
            opacity: '0',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px'
        }
    }),
    reduxForm({
        form: 'PermissionCreateForm',
        enableReinitialize: true
    })
)
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
const ONE = 1
const ZERO = 0
const PermissionGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        actionsDialog,
        confirmDialog,
        listData,
        detailData,
        setDateDialog,
        classes
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon />
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <DeleteIcon />
            </IconButton>
        </div>
    )

    const permissionDetail = (
        <span>a</span>
    )

    const permissionList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const fromTime = _.get(item, 'fromTime')
        const toTime = _.get(item, 'toTime')
        const status = _.toInteger(_.get(item, 'status'))

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={4}>{name}</Col>
                <Col xs={2}>{fromTime}</Col>
                <Col xs={2}>{toTime}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <div className={classes.iconBtn}>
                        <Field
                            filter={filter}
                            name={'toggle' + id}
                            status={status}
                            id={id}
                            update={() => { updateDialog.handleSubmitUpdateDialog(id, _.toInteger(status) === ONE) }}
                            component={PermissionToggle}
                        />
                    </div>
                </Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <div className={classes.iconBtn}>
                        <Tooltip position="bottom" text="Изменить">
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                touch={true}
                                onTouchTap={() => { setDateDialog.handleOpenSetDateDialog(id) }}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: permissionList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.PERMISSION_LIST_URL}/>
                <div className={classes.rightPanel}>
                    <GridList
                        filter={filter}
                        list={list}
                        detail={permissionDetail}
                        actionsDialog={actions}
                        transparentLoading={true}
                        listShadow={false}
                    />
                </div>
            </div>

            <PermissionCreateDialog
                initialValues={{}}
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <PermissionCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />
            <SetDateDialog
                initialValues={setDateDialog.initialValues}
                open={_.toInteger(setDateDialog.open) > ZERO ? true : toBoolean(setDateDialog.open)}
                loading={setDateDialog.loading}
                onClose={setDateDialog.handleCloseSetDateDialog}
                onSubmit={setDateDialog.handleSubmitSetDateDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'name'])}
                loading={confirmDialog.confirmLoading}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

PermissionGridList.propTypes = {
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
    confirmDialog: PropTypes.shape({
        confirmLoading: PropTypes.bool.isRequired,
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

export default PermissionGridList
