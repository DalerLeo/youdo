import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import sprintf from 'sprintf'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ClientCreateDialog from './ClientCreateDialog'
import DeleteDialog from '../DeleteDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
import Edit from 'material-ui/svg-icons/image/edit'
import {Link} from 'react-router'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        xs: 2,
        title: 'Id'
    },
    {
        sorting: true,
        name: 'name',
        xs: 6,
        title: 'Наименование'
    },
    {
        sorting: true,
        xs: 3,
        name: 'created_date',
        title: 'Дата создания'
    },
    {
        sorting: false,
        xs: 1,
        name: 'actions',
        title: ''
    }
]

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const tooltipPosition = 'bottom-center'

const colorBlue = '#12aaeb !important'
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
        },
        actionBtn: {
            height: '48px'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            '& a': {
                color: colorBlue
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        container: {
            display: 'flex',
            width: '100%'
        },
        sides: {
            flexBasis: '27%'
        },
        leftSide: {
            extend: 'sides',
            borderRight: '1px #efefef solid',
            padding: '20px 30px'
        },
        rightSide: {
            extend: 'sides',
            borderLeft: '1px #efefef solid',
            padding: '20px 30px'
        },
        body: {
            flexBasis: '66%',
            padding: '20px 30px',
            '& .dottedList': {
                padding: '10px 0',
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    padding: '0 0 10px'
                },
                '&:last-child': {
                    padding: '10px 0 0',
                    '&:after': {
                        display: 'none'
                    }
                }
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        }
    })
)

const ClientGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        actionsDialog,
        confirmDialog,
        deleteDialog,
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
    const contacts = _.get(detailData, ['data', 'contacts'])
    const date = moment(_.get(detailData, ['data', 'createdDate'])).format('DD.MM.YYYY')
    const address = _.get(detailData, ['data', 'address']) || 'N/A'
    const providerName = _.get(detailData, ['data', 'name'])

    const clientDetail = (
        <div className={classes.wrapper} key={_.get(detailData, 'id')}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{providerName}</div>
                <div className={classes.titleButtons}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        disableTouchRipple={true}
                        onTouchTap={updateDialog.handleOpenUpdateDialog}
                        tooltipPosition={tooltipPosition}
                        tooltip="Изменить">
                        <Edit />
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        disableTouchRipple={true}
                        onTouchTap={confirmDialog.handleOpenConfirmDialog}
                        tooltipPosition={tooltipPosition}
                        tooltip="Удалить">
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.leftSide}>
                    <div className={classes.bodyTitle}>Адрес</div>
                    <div>{address}</div>
                </div>
                <div className={classes.body}>
                    <div className={classes.bodyTitle}>Контакты</div>
                    <div>
                        {_.map(contacts, (item) => {
                            const name = _.get(item, 'name')
                            const phone = _.get(item, 'telephone')
                            const email = _.get(item, 'email')
                            return (
                                <Row key={item.id} className="dottedList">
                                    <Col xs={4}>{name}</Col>
                                    <Col xs={4}>{email}</Col>
                                    <Col xs={4}>{phone}</Col>
                                </Row>
                            )
                        })}
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.bodyTitle}>Дата добавления</div>
                    <div>{date}</div>
                </div>
            </div>
        </div>
    )

    const clientList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={id}>
                <Col xs={2}>{id}</Col>
                <Col xs={7}>
                    <Link to={{
                        pathname: sprintf(ROUTES.CLIENT_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={3}>{createdDate}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: clientList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.CLIENT_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить клиента">
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
                detail={clientDetail}
                actionsDialog={actions}
            />

            <ClientCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <ClientCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <DeleteDialog
                filter={filter}
                open={deleteDialog.openDeleteDialog}
                onClose={deleteDialog.handleCloseDeleteDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={_.get(detailData, ['data', 'name'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

ClientGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    tabData: PropTypes.object.isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    deleteDialog: PropTypes.shape({
        openDeleteDialog: PropTypes.bool.isRequired,
        handleOpenDeleteDialog: PropTypes.func.isRequired,
        handleCloseDeleteDialog: PropTypes.func.isRequired
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

export default ClientGridList
