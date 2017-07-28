import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import UsersFilterForm from './UsersFilterForm'
import UsersCreateDialog from './UsersCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'
import Tooltip from '../ToolTip'
const ZERO = 0
const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: '№',
        xs: 1
    },
    {
        sorting: true,
        name: 'username',
        title: 'Пользователь',
        xs: 2
    },
    {
        sorting: true,
        name: 'login',
        title: 'Логин',
        xs: 2
    },
    {
        sorting: true,
        name: 'typeUser',
        title: 'Должность',
        xs: 2
    },
    {
        sorting: true,
        name: 'phoneNumber',
        title: 'Телефон',
        xs: 2
    },
    {
        sorting: true,
        name: 'createdDate',
        title: 'Дата создания',
        xs: 1
    }
]

const enhance = compose(
    injectSheet({
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        }
    })
)

const UsersGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        actionsDialog,
        confirmDialog,
        groupListData,
        listData,
        detailData,
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

    const usersFilterDialog = (
        <UsersFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const usersDetail = (
        <span>a</span>
    )
    const usersList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const username = _.get(item, 'username')
        const firstName = _.get(item, 'firstName')
        const secondName = _.get(item, 'secondName')
        const phoneNumber = _.get(item, 'phoneNumber') || 'N/A'
        const groups = _.get(item, ['groups', ZERO, 'name']) || 'N/A'

        const iconButton = (
            <IconButton style={{padding: '0 12px'}}>
                <MoreVertIcon />
            </IconButton>
        )

        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{firstName} {secondName}</Col>
                <Col xs={2}>{username}</Col>
                <Col xs={2}>{groups}</Col>
                <Col xs={2}>{phoneNumber}</Col>
                <Col xs={2}>12.05.2016</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconMenu
                        iconButtonElement={iconButton}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText="Изменить"
                            leftIcon={<Edit />}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}
                        />
                        <MenuItem
                            primaryText="Удалить "
                            leftIcon={<DeleteIcon />}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                        />
                    </IconMenu>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: usersList,
        loading: _.get(listData, 'listLoading')
    }

    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(detailData, 'id'))})
    const currentName = _.get(currentDetail, 'firstName') + ' ' + _.get(currentDetail, 'secondName')
    return (
        <Container>
            <SubMenu url={ROUTES.USERS_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить пользователя">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <GridList
                filter={filter}
                list={list}
                detail={usersDetail}
                actionsDialog={actions}
                filterDialog={usersFilterDialog}
            />

            <UsersCreateDialog
                initialValues={createDialog.initialValues}
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                errorData={createDialog.errorData}
                groupListData={groupListData}
            />

            <UsersCreateDialog
                initialValues={updateDialog.initialValues}
                isUpdate={true}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                errorData={updateDialog.errorData}

            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={currentName}
                loading={confirmDialog.confirmLoading}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

UsersGridList.propTypes = {
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
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default UsersGridList
