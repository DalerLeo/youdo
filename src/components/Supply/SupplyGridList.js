import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import SupplyFilterForm from './SupplyFilterForm'
import SupplyDetails from './SupplyDetails'
import SupplyCreateDialog from './SupplyCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import SupplyExpenseCreateDialog from './SupplyExpenseCreateDialog'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: '№',
        xs: 1
    },
    {
        sorting: true,
        name: 'name',
        title: 'Поставщик',
        xs: 2
    },
    {
        sorting: true,
        name: 'stock',
        title: 'Склад',
        xs: 2
    },
    {
        sorting: true,
        name: 'dateDelivery',
        title: 'Дата поставки',
        xs: 2
    },
    {
        sorting: true,
        name: 'totalCost',
        title: 'Цена заказа',
        xs: 2
    },
    {
        sorting: true,
        name: 'status',
        title: 'Статус',
        xs: 1
    },
    {
        sorting: true,
        name: 'acceptedCost',
        title: 'Принято',
        xs: 1
    },
    {
        sorting: true,
        name: 'defectedCost',
        title: 'Браковано',
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
        },
        dot: {
            display: 'inline-block',
            height: '7px',
            width: '7px',
            borderRadius: '50%',
            marginRight: '6px'
        },
        success: {
            extend: 'dot',
            backgroundColor: '#81c784'
        },
        begin: {
            extend: 'dot',
            backgroundColor: '#64b5f6'
        },
        error: {
            extend: 'dot',
            backgroundColor: '#e57373'
        },
        waiting: {
            extend: 'dot',
            backgroundColor: '#f0ad4e'
        }
    })
)

const SupplyGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        actionsDialog,
        confirmDialog,
        confirmExpenseDialog,
        deleteDialog,
        listData,
        detailData,
        classes,

        supplyExpenseCreateDialog,
        supplyListData
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

    const supplyFilterDialog = (
        <SupplyFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const supplyDetail = (
        <SupplyDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            deleteDialog={deleteDialog}
            confirmDialog={confirmDialog}
            confirmExpenseDialog={confirmExpenseDialog}
            updateDialog={updateDialog}
            loading={_.get(detailData, 'detailLoading')}
            handleSupplyExpenseOpenCreateDialog={supplyExpenseCreateDialog.handleSupplyExpenseOpenCreateDialog}
            supplyListData={supplyListData}
        />
    )

    const PENDING = 0
    const IN_PROGRESS = 1
    const COMPLETED = 2

    const supplyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(_.get(item, 'provider'), 'name')
        const stock = _.get(_.get(item, 'stock'), 'name') || 'N/A'
        const dateDelivery = _.get(item, 'dateDelivery') || 'Не указано'
        const totalCost = numberFormat(_.get(item, 'totalCost'), _.get(item, ['currency', 'name']))
        const acceptedCost = numberFormat(_.get(item, 'acceptedCost'), _.get(item, ['currency', 'name']))
        const defectedCost = numberFormat(_.get(item, 'defectedCost'), _.get(item, ['currency', 'name']))
        const status = _.toNumber(_.get(item, 'status'))

        return (
            <Row key={id}>
                <Col xs={1}>{id}</Col>
                <Col xs={2}>
                    <Link to={{
                        pathname: sprintf(ROUTES.SUPPLY_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={2}>{stock}</Col>
                <Col xs={2}>{dateDelivery}</Col>
                <Col xs={2}>{totalCost}</Col>
                <Col xs={1}>{status === PENDING ? (<span><i className={classes.waiting} /> ожидает</span>)
                    : ((status === IN_PROGRESS) ? (<span><i className={classes.begin} /> начался</span>)
                        : (status === COMPLETED) ? (<span><i className={classes.success} /> принято</span>)
                            : (<span><i className={classes.error} /> отменен</span>))}</Col>
                <Col xs={1}>{acceptedCost}</Col>
                <Col xs={1}>{defectedCost}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: supplyList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.SUPPLY_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить поставку">
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
                detail={supplyDetail}
                actionsDialog={actions}
                filterDialog={supplyFilterDialog}
            />

            <SupplyCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <SupplyCreateDialog
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <SupplyExpenseCreateDialog
                open={supplyExpenseCreateDialog.openSupplyExpenseCreateDialog}
                loading={supplyExpenseCreateDialog.supplyExpenseLoading}
                onClose={supplyExpenseCreateDialog.handleSupplyExpenseCloseCreateDialog}
                onSubmit={supplyExpenseCreateDialog.handleSupplyExpenseSubmitCreateDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message={'Постака № ' + _.get(detailData, ['data', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}

            <ConfirmDialog
                type="delete"
                message={'weqwe' + _.get(detailData, ['data', 'id'])}
                onClose={confirmExpenseDialog.handleCloseConfirmExpenseDialog}
                onSubmit={confirmExpenseDialog.handleSendConfirmExpenseDialog}
                open={confirmExpenseDialog.openConfirmExpenseDialog}
            />
        </Container>
    )
})

SupplyGridList.propTypes = {
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
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmExpenseDialog: PropTypes.shape({
        openConfirmExpenseDialog: PropTypes.bool.isRequired,
        handleOpenConfirmExpenseDialog: PropTypes.func.isRequired,
        handleCloseConfirmExpenseDialog: PropTypes.func.isRequired,
        handleSendConfirmExpenseDialog: PropTypes.func.isRequired
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
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,

    supplyExpenseCreateDialog: PropTypes.shape({
        supplyExpenseLoading: PropTypes.bool.isRequired,
        openSupplyExpenseCreateDialog: PropTypes.bool.isRequired,
        handleSupplyExpenseOpenCreateDialog: PropTypes.func.isRequired,
        handleSupplyExpenseCloseCreateDialog: PropTypes.func.isRequired,
        handleSupplyExpenseSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    supplyListData: PropTypes.shape({
        data: PropTypes.array,
        supplyExpenseListLoading: PropTypes.bool.isRequired,
        handleSupplyExpenseOpenDeleteDialog: PropTypes.func.isRequired,
        handleSupplyExpenseCloseDeleteDialog: PropTypes.func.isRequired,
        handleSupplyExpenseActionDelete: PropTypes.func.isRequired,
        openSupplyExpenseConfirmDialog: PropTypes.bool.isRequired,
        handleSupplyExpenseOpenConfirmDialog: PropTypes.func.isRequired,
        handleSupplyExpenseCloseConfirmDialog: PropTypes.func.isRequired,
        handleSupplyExpenseSendConfirmDialog: PropTypes.func.isRequired

    })
}

export default SupplyGridList
