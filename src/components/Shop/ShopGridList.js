import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ShopFilterForm from './ShopFilterForm'
import ShopDetails from './ShopDetails'
import ShopCreateDialog from './ShopCreateDialog'
import MapDialog from './ShopMapDialog'
import ShopMultiUpdateDialog from './ShopMultiUpdateDialog'
import AddPhotoDialog from './AddPhotoDialog'
import SlideShowDialog from './SlideShowDialog'
import DeleteDialog from '../DeleteDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'
import toBoolean from '../../helpers/toBoolean'
import checkPermission from '../../helpers/checkPermission'
import Edit from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton'

// CHECKING PERMISSIONS
const canCreateMarket = checkPermission('add_market')
const canEditMarket = checkPermission('change_market')
const canDeleteMarket = checkPermission('delete_market')

const listHeader = [
    {
        xs: 3,
        sorting: false,
        name: 'name',
        title: t('Название')
    },
    {
        xs: 3,
        sorting: false,
        name: 'client',
        title: t('Клиент')
    },
    {
        xs: 2,
        sorting: false,
        name: 'market_type',
        title: t('Тип')
    },
    {
        xs: 2,
        sorting: false,
        name: 'border',
        title: t('Зона')
    },
    {
        xs: 2,
        sorting: false,
        name: 'responsible_agent',
        title: t('Ответственный агент')
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
        listRow: {
            position: 'relative',
            margin: '0 -30px !important',
            padding: '0 30px !important',
            width: 'auto !important',
            '& > a': {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            }
        },
        listWithCheckbox: {
            marginLeft: '-50px !important',
            paddingLeft: '55px !important'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
        },
        status: {
            position: 'absolute',
            left: '0',
            top: '0',
            bottom: '0',
            width: '3px'
        },
        statusActive: {
            extend: 'status',
            background: '#81c784'
        },
        statusInactive: {
            extend: 'status',
            background: '#e57373'
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
        confirmDialog,
        imageDeleteDialog,
        deleteDialog,
        listData,
        detailData,
        mapLocation,
        navigationButtons,
        multiUpdateDialog,
        classes
    } = props

    const showCheckboxes = toBoolean(_.get(filter.getParams(), 'showCheckboxes'))
    const checkboxActions = (
        <div className={classes.buttons}>
            <ToolTip position="left" text={t('Изменить выбранные магазины')}>
                <IconButton onTouchTap={multiUpdateDialog.handleOpenMultiUpdate}>
                    <Edit color="#666"/>
                </IconButton>
            </ToolTip>
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
            imageDeleteDialog={imageDeleteDialog}
            loading={_.get(detailData, 'detailLoading')}
            updateDialog={updateDialog}
            addPhotoDialog={addPhotoDialog}
            slideShowDialog={slideShowDialog}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            mapDialog={mapDialog}
            canEditMarket={canEditMarket}
            canDeleteMarket={canDeleteMarket}
        />
    )
    const shopList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const client = _.get(item, ['client', 'name'])
        const marketType = _.get(item, ['marketType', 'name'])
        const responsibleAgent = _.get(item, ['responsibleAgent', 'firstName']) + ' ' + _.get(item, ['responsibleAgent', 'secondName'])
        const zone = _.get(item, ['border', 'title']) || t('Не определена')
        const isActive = _.get(item, 'isActive')
        return (
            <Row key={id} className={classes.listRow + ' ' + (showCheckboxes ? classes.listWithCheckbox : '')}>
                <Col xs={3}>{name}</Col>
                <Col xs={3}>{client}</Col>
                <Link to={{
                    pathname: sprintf(ROUTES.SHOP_ITEM_PATH, id),
                    query: filter.getParams()}}/>
                <div className={classes.status + ' ' + (isActive ? classes.statusActive : classes.statusInactive)}/>
                <Col xs={2}>{marketType}</Col>
                <Col xs={2}>{zone}</Col>
                <Col xs={2}>{responsibleAgent}</Col>
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
            {canCreateMarket &&
            <div className={classes.addButtonWrapper}>
                <ToolTip position="left" text={t('Добавить магазин')}>
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={createDialog.handleOpenCreateDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </ToolTip>
            </div>}
            <GridList
                filter={filter}
                list={list}
                detail={shopDetail}
                filterDialog={shopFilterDialog}
                withCheckboxes={canEditMarket}
                activeCheckboxes={showCheckboxes}
                checkboxActions={checkboxActions}
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
                viewOnly={false}
                initialValues={mapDialog.initialValues}
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
                images={_.get(detailData, ['data', 'images'])}
                loading={slideShowDialog.galleryLoading}
                open={slideShowDialog.openSlideShowDialog}
                image={slideShowDialog.gallery}
                onClose={slideShowDialog.handleCloseSlideShowDialog}
                prevBtn={navigationButtons.handlePrevImage}
                nextBtn={navigationButtons.handleNextImage}
                handleSetPrimaryImage={_.get(detailData, 'handleSetPrimaryImage')}
            />
            <MapDialog
                isUpdate={true}
                viewOnly={false}
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
            {detailData.data && <ConfirmDialog
                type="delete"
                message=""
                onClose={imageDeleteDialog.handleCloseDeleteImageDialog}
                onSubmit={imageDeleteDialog.handleSendDeleteImageDialog}
                open={imageDeleteDialog.openDeleteImage}
            />}

            <ShopMultiUpdateDialog
                open={multiUpdateDialog.open}
                onClose={multiUpdateDialog.handleCloseMultiUpdate}
                onSubmit={multiUpdateDialog.handleSubmitMultiUpdate}
            />
        </Container>
    )
})
ShopGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
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
        gallery: PropTypes.object,
        galleryLoading: PropTypes.bool.isRequired,
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
    imageDeleteDialog: PropTypes.shape({
        openDeleteImage: PropTypes.bool.isRequired,
        handleOpenDeleteImageDialog: PropTypes.func.isRequired,
        handleCloseDeleteImageDialog: PropTypes.func.isRequired,
        handleSendDeleteImageDialog: PropTypes.func.isRequired
    }).isRequired,
    deleteDialog: PropTypes.shape({
        openDeleteDialog: PropTypes.bool.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    navigationButtons: PropTypes.shape({
        handlePrevImage: PropTypes.func.isRequired,
        handleNextImage: PropTypes.func.isRequired
    }),
    multiUpdateDialog: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpenMultiUpdate: PropTypes.func.isRequired,
        handleCloseMultiUpdate: PropTypes.func.isRequired,
        handleSubmitMultiUpdate: PropTypes.func.isRequired
    })
}
export default ShopGridList
