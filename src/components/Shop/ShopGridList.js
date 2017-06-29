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
import ShopFilterForm from './ShopFilterForm'
import ShopDetails from './ShopDetails'
import ShopCreateDialog from './ShopCreateDialog'
import MapDialog from './ShopMapDialog'
import AddPhotoDialog from './AddPhotoDialog'
import SlideShowDialog from './SlideShowDialog'
import DeleteDialog from '../DeleteDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'

const listHeader = [
    {
        xs: 3,
        sorting: true,
        name: 'name',
        title: 'Название'
    },
    {
        xs: 3,
        sorting: true,
        name: 'client',
        title: 'Клиент'
    },
    {
        xs: 2,
        sorting: true,
        name: 'marketType',
        title: 'Тип'
    },
    {
        xs: 2,
        sorting: true,
        name: 'border',
        title: 'Зона'
    },
    {
        xs: 2,
        sorting: true,
        name: 'isActive',
        title: 'Статус'
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

const ShopGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        mapDialog,
        updateDialog,
        updateMapDialog,
        addPhotoDialog,
        filterDialog,
        slideShowDialog,
        actionsDialog,
        confirmDialog,
        deleteDialog,
        listData,
        detailData,
        tabData,
        mapLocation,
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

    const shopFilterDialog = (
        <ShopFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )
    const shopDetail = (
        <ShopDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            deleteDialog={deleteDialog}
            confirmDialog={confirmDialog}
            loading={_.get(detailData, 'detailLoading')}
            tabData={tabData}
            updateDialog={updateDialog}
            addPhotoDialog={addPhotoDialog}
            slideShowDialog={slideShowDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
        />
    )

    const shopList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const client = _.get(item, ['client', 'name'])
        const marketType = _.get(item, ['marketType', 'name'])
        const zone = _.get(item, 'border') || 'Не определена'
        const isActive = _.get(item, 'isActive')

        return (
            <Row key={id}>
                <Col xs={3}>
                    <Link to={{
                        pathname: sprintf(ROUTES.SHOP_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>{name}</Link>
                </Col>
                <Col xs={3}>{client}</Col>
                <Col xs={2}>{marketType}</Col>
                <Col xs={2}>{zone}</Col>
                <Col xs={2}>
                    {isActive ? <span className="greenFont">Активен</span>
                    : <span className="redFont">Не активен</span>}
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: shopList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.SHOP_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить магазин">
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
                detail={shopDetail}
                actionsDialog={actions}
                filterDialog={shopFilterDialog}
            />

            <ShopCreateDialog
                mapDialog={mapDialog}
                updateMapDialog={updateMapDialog}
                mapLocation={mapLocation}
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            <MapDialog
                open={mapDialog.openMapDialog}
                onClose={mapDialog.handleCloseMapDialog}
                onSubmit={mapDialog.handleSubmitMapDialog}
            />

            <AddPhotoDialog
                open={addPhotoDialog.openAddPhotoDialog}
                onClose={addPhotoDialog.handleCloseAddPhotoDialog}
                onSubmit={addPhotoDialog.handleSubmitAddPhotoDialog}
            />

            <SlideShowDialog
                open={slideShowDialog.openSlideShowDialog}
                onClose={slideShowDialog.handleCloseSlideShowDialog}
            />

            <MapDialog
                isUpdate={true}
                initialValues={updateMapDialog.initialValues}
                open={updateMapDialog.openUpdateMapDialog}
                onClose={updateMapDialog.handleCloseMapUpdateDialog}
                onSubmit={updateMapDialog.handleSubmitMapUpdateDialog}
            />

            <ShopCreateDialog
                isUpdate={true}
                mapDialog={mapDialog}
                mapLocation={mapLocation}
                updateMapDialog={updateMapDialog}
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

ShopGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    tabData: PropTypes.object.isRequired,
    mapLocation: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    mapDialog: PropTypes.shape({
        openMapDialog: PropTypes.bool.isRequired,
        handleOpenMapDialog: PropTypes.func.isRequired,
        handleCloseMapDialog: PropTypes.func.isRequired,
        handleSubmitMapDialog: PropTypes.func.isRequired
    }).isRequired,
    addPhotoDialog: PropTypes.shape({
        openAddPhotoDialog: PropTypes.bool.isRequired,
        handleOpenAddPhotoDialog: PropTypes.func.isRequired,
        handleCloseAddPhotoDialog: PropTypes.func.isRequired,
        handleSubmitAddPhotoDialog: PropTypes.func.isRequired
    }).isRequired,
    slideShowDialog: PropTypes.shape({
        openSlideShowDialog: PropTypes.bool.isRequired,
        handleOpenSlideShowDialog: PropTypes.func.isRequired,
        handleCloseSlideShowDialog: PropTypes.func.isRequired
    }).isRequired,
    updateMapDialog: PropTypes.shape({
        openUpdateMapDialog: PropTypes.bool.isRequired,
        handleOpenMapUpdateDialog: PropTypes.func.isRequired,
        handleCloseMapUpdateDialog: PropTypes.func.isRequired,
        handleSubmitMapUpdateDialog: PropTypes.func.isRequired
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

export default ShopGridList
