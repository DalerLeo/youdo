import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import UsersFilterForm from './UsersFilterForm'
import UsersCreateDialog from './UsersCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SettingSideMenu from '../Settings/SettingsSideMenu'
import ToolTip from '../ToolTip'
import toBoolean from '../../helpers/toBoolean'
import t from '../../helpers/translate'

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            margin: '0 -28px',
            height: 'calc(100% + 28px)'
        },
        addButton: {
            '& svg': {
                width: '14px !important',
                height: '14px !important'
            }
        },
        addButtonWrapper: {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-18px'
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            background: '#fff',
            flexBasis: 'calc(100% - 225px)',
            maxWidth: 'calc(100% - 225px)',
            paddingTop: '10px',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        iconBtn: {
            display: 'flex',
            opacity: '0',
            transition: 'all 200ms ease-out'
        },
        listRow: {
            margin: '0 -30px !important',
            width: 'auto !important',
            padding: '0 30px',
            '&:hover > div:last-child > div ': {
                opacity: '1'
            },
            '& > div': {
                overflow: 'hidden',
                wordBreak: 'normal',
                textOverflow: 'ellipsis'
            }
        }
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

const UsersGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        actionsDialog,
        confirmDialog,
        groupListData,
        stockListData,
        marketTypeData,
        listData,
        detailData,
        currencyData,
        divisionData,
        classes
    } = props
    const listHeader = [
        {
            sorting: true,
            name: 'id',
            title: '№',
            xs: 1
        },
        {
            sorting: false,
            name: 'username',
            title: t('Сотрудник'),
            xs: 2
        },
        {
            sorting: false,
            name: 'login',
            title: t('Логин'),
            xs: 2
        },
        {
            sorting: false,
            name: 'typeUser',
            title: t('Права доступа'),
            xs: 2
        },
        {
            sorting: false,
            name: 'phoneNumber',
            title: t('Телефон'),
            xs: 2
        },
        {
            sorting: false,
            name: 'job',
            title: t('Должность'),
            xs: 1
        },
        {
            sorting: false,
            name: 'status',
            title: t('Статус'),
            xs: 1
        }
    ]
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

    const usersDetail = (
        <span>a</span>
    )
    const usersList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const isActive = toBoolean(_.get(item, 'isActive'))
        const username = isActive ? _.get(item, 'username') : 'Не указано'
        const firstName = _.get(item, 'firstName')
        const secondName = _.get(item, 'secondName')
        const phoneNumber = _.get(item, 'phoneNumber') || '-'
        const job = _.get(item, ['job', 'name']) || 'Не указана'
        const position = _.get(item, ['position', 'name']) || 'Не выбрано'
        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{firstName} {secondName}</Col>
                <Col xs={2} title={username}>{username}</Col>
                <Col xs={2}>{position}</Col>
                <Col xs={2}>{phoneNumber}</Col>
                <Col xs={1}>{job}</Col>
                <Col xs={1}>{isActive ? t('Активный') : t('Неактивный')}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <div className={classes.iconBtn}>
                        <ToolTip position="bottom" text={t('Изменить')}>
                            <IconButton
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                disableTouchRipple={true}
                                touch={true}
                                onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                                <Edit />
                            </IconButton>
                        </ToolTip>
                        <ToolTip position="bottom" text={t('Удалить')}>
                            <IconButton
                                disableTouchRipple={true}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}
                                onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
                                touch={true}>
                                <DeleteIcon />
                            </IconButton>
                        </ToolTip>
                    </div>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: usersList,
        loading: _.get(listData, 'listLoading')
    }

    const addButton = (
        <div className={classes.addButtonWrapper}>
            <FlatButton
                backgroundColor="#fff"
                labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
                className={classes.addButton}
                label="добавить пользователя"
                onTouchTap={createDialog.handleOpenCreateDialog}
                icon={<ContentAdd color="#12aaeb"/>}>
            </FlatButton>
        </div>
    )

    const usersFilterDialog = (
        <UsersFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
            addButton={addButton}
        />
    )

    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(detailData, 'id'))})
    const currentName = _.get(currentDetail, 'firstName') + ' ' + _.get(currentDetail, 'secondName')
    return (
        <Container>
            <div className={classes.wrapper}>
                <SettingSideMenu currentUrl={ROUTES.USERS_LIST_URL} usersFilterDialog={usersFilterDialog}/>
                <div className={classes.rightPanel}>
                    <GridList
                        filter={filter}
                        list={list}
                        listShadow={false}
                        detail={usersDetail}
                        actionsDialog={actions}
                        addButton={addButton}
                    />
                </div>
            </div>

            {createDialog.openCreateDialog &&
            <UsersCreateDialog
                detailData={_.get(detailData, 'data')}
                initialValues={createDialog.initialValues}
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
                errorData={createDialog.errorData}
                groupListData={groupListData}
                stockListData={stockListData}
                marketTypeData={marketTypeData}
                currencyData={currencyData}
                divisionData={divisionData}
            />}

            {updateDialog.openUpdateDialog &&
            <UsersCreateDialog
                detailData={_.get(detailData, 'data')}
                initialValues={updateDialog.initialValues}
                isUpdate={true}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                groupListData={groupListData}
                stockListData={stockListData}
                marketTypeData={marketTypeData}
                currencyData={currencyData}
                divisionData={divisionData}
                errorData={updateDialog.errorData}
            />}

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
