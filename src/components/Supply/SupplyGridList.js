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
import SupplyDefectDialog from './SupplyDefectDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import SupplyExpenseCreateDialog from './SupplyExpenseCreateDialog'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import {connect} from 'react-redux'
import AddProductDialog from '../Order/OrderAddProductsDialog'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: '№',
        xs: 1
    },
    {
        sorting: false,
        name: 'name',
        title: 'Поставщик',
        xs: 2
    },
    {
        sorting: false,
        name: 'stock',
        title: 'Склад',
        xs: 2
    },
    {
        sorting: true,
        name: 'dateDelivery',
        title: 'Дата поставки',
        xs: 1
    },
    {
        sorting: true,
        name: 'paymentType',
        title: 'Тип оплаты',
        xs: 1
    },
    {
        sorting: true,
        name: 'contract',
        title: 'Номер договора',
        xs: 1
    },
    {
        sorting: true,
        name: 'totalCost',
        alignRight: true,
        title: 'Цена заказа',
        xs: 1
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
        alignRight: true,
        title: 'Принято',
        xs: 1
    },
    {
        sorting: true,
        name: 'defectedCost',
        alignRight: true,
        title: 'Браковано',
        xs: 1
    }
]

const enhance = compose(
    injectSheet({
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
            backgroundColor: '#f0ad4e'
        },
        error: {
            extend: 'dot',
            backgroundColor: '#e57373'
        },
        waiting: {
            extend: 'dot',
            backgroundColor: '#64b5f6'
        },
        listRow: {
            position: 'relative',
            '& > a': {
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'content-box',
                position: 'absolute',
                top: '0',
                left: '-30px',
                right: '-30px',
                bottom: '0',
                padding: '0 30px',
                '& > div:first-child': {
                    fontWeight: '600'
                },
                '& > div': {
                    fontWeight: '400'
                }
            }
        }
    }),
    connect((state) => {
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])

        return {isAdmin}
    })
)

const SupplyGridList = enhance((props) => {
    const {
        filter,
        filterItem,
        createDialog,
        defectDialog,
        updateDialog,
        filterDialog,
        actionsDialog,
        confirmDialog,
        confirmExpenseDialog,
        deleteDialog,
        listData,
        detailData,
        classes,
        isAdmin,
        supplyExpenseCreateDialog,
        supplyListData,
        tabData,
        paidData,
        addProductDialog
    } = props

    const actions = (
        <div>
            <IconButton onTouchTap={actionsDialog.handleActionEdit}>
                <ModEditorIcon/>
            </IconButton>

            <IconButton onTouchTap={actionsDialog.handleActionDelete}>
                <DeleteIcon/>
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
            defectDialog={defectDialog}
            deleteDialog={deleteDialog}
            confirmDialog={confirmDialog}
            confirmExpenseDialog={confirmExpenseDialog}
            updateDialog={updateDialog}
            loading={_.get(detailData, 'detailLoading')}
            handleSupplyExpenseOpenCreateDialog={supplyExpenseCreateDialog.handleSupplyExpenseOpenCreateDialog}
            supplyListData={supplyListData}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            filter={filterItem}
            isAdmin={isAdmin}
            tabData={tabData}
            paidData={paidData}
        />
    )

    const PENDING = 0
    const IN_PROGRESS = 1
    const COMPLETED = 2
    const supplyList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(_.get(item, 'provider'), 'name')
        const stock = _.get(_.get(item, 'stock'), 'name') || 'N/A'
        const dateDelivery = _.get(item, 'dateDelivery') ? dateFormat(_.get(item, 'dateDelivery')) : 'Не указано'
        const totalCost = numberFormat(_.get(item, 'totalCost'), _.get(item, ['currency', 'name']))
        const acceptedCost = numberFormat(_.get(item, 'acceptedCost'), _.get(item, ['currency', 'name']))
        const defectedCost = numberFormat(_.get(item, 'defectCost'), _.get(item, ['currency', 'name']))
        const status = _.toNumber(_.get(item, 'status'))
        const contract = _.get(item, 'contract')
        const paymentType = _.get(item, 'paymentType') === 'cash' ? 'Наличный' : 'Банковский счет'

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={1}>{id}</Col>
                <Link to={{
                    pathname: sprintf(ROUTES.SUPPLY_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                </Link>
                <Col xs={2}>{name}</Col>
                <Col xs={2}>{stock}</Col>
                <Col xs={1}>{dateDelivery}</Col>
                <Col xs={1}>{paymentType}</Col>
                <Col xs={1}>{contract}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>{totalCost}</Col>
                <Col xs={1}>{status === PENDING ? (<span><i className={classes.waiting}/> ожидает</span>)
                    : ((status === IN_PROGRESS) ? (<span><i className={classes.begin}/> начался</span>)
                        : (status === COMPLETED) ? (<span><i className={classes.success}/> принято</span>)
                            : (<span><i className={classes.error}/> отменен</span>))}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>{acceptedCost}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>{defectedCost}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: supplyList,
        loading: _.get(listData, 'listLoading')
    }

    const detailStatus = _.toInteger(_.get(detailData, ['data', 'status']))
    const expense = _.find(_.get(supplyListData, 'data'), {'id': confirmExpenseDialog.removeId})
    const expComment = _.get(expense, 'comment')
    return (
        <Container>
            <SubMenu url={ROUTES.SUPPLY_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить поставку">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd/>
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
                handleOpenAddProduct={addProductDialog.handleOpenAddProduct}
            />

            <SupplyDefectDialog
                open={defectDialog.openDefectDialog}
                onClose={defectDialog.handleCloseDefectDialog}
                defectData={_.get(detailData, 'defect')}
            />

            <SupplyCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                handleOpenAddProduct={addProductDialog.handleOpenAddProduct}
            />

            <SupplyExpenseCreateDialog
                open={supplyExpenseCreateDialog.openSupplyExpenseCreateDialog}
                loading={supplyExpenseCreateDialog.supplyExpenseLoading}
                onClose={supplyExpenseCreateDialog.handleSupplyExpenseCloseCreateDialog}
                onSubmit={supplyExpenseCreateDialog.handleSupplyExpenseSubmitCreateDialog}
            />

            {(detailData.data && isAdmin && (detailStatus === IN_PROGRESS || detailStatus === COMPLETED)) ? <ConfirmDialog
                type="cancel"
                message={'Склад уже принял данную поставку. Отмена приведет к списанию товаров из' +
                    ' склада. ОТМЕНА НЕ РЕКОМЕНДУЕТСЯ!'}
                warning={true}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />

            : (detailData.data && <ConfirmDialog
                type="cancel"
                message={'Поставка № ' + _.get(detailData, ['data', 'id'])}
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />)}

            {confirmExpenseDialog.removeId && <ConfirmDialog
                type="delete"
                message={'Дополнительный расход: ' + expComment}
                onClose={confirmExpenseDialog.handleCloseConfirmExpenseDialog}
                onSubmit={confirmExpenseDialog.handleSendConfirmExpenseDialog}
                open={confirmExpenseDialog.openConfirmExpenseDialog}
            />}

            {addProductDialog.openAddProductDialog &&
            <AddProductDialog
                open={addProductDialog.openAddProductDialog}
                loading={addProductDialog.loading}
                filter={addProductDialog.filter}
                data={addProductDialog.data}
                onClose={addProductDialog.handleCloseAddProduct}
                onSubmit={addProductDialog.handleSubmitAddProduct}
                initialValues={addProductDialog.initialValues}
                openAddProductConfirm={addProductDialog.openAddProductConfirm}
                handleCloseAddProductConfirm={addProductDialog.handleCloseAddProductConfirm}
                handleSubmitAddProductConfirm={addProductDialog.handleSubmitAddProductConfirm}
                withoutCustomPrice={true}
            />}
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
    defectDialog: PropTypes.shape({
        openDefectDialog: PropTypes.bool.isRequired,
        handleOpenDefectDialog: PropTypes.func.isRequired,
        handleCloseDefectDialog: PropTypes.func.isRequired
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
        openSupplyExpenseConfirmDialog: PropTypes.bool.isRequired
    })
}

export default SupplyGridList
