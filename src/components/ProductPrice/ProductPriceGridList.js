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
import ProductPriceFilterForm from './ProductPriceFilterForm'
import ProductPriceCreateDialog from './ProductPriceCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Наименование',
        xs: 3
    },
    {
        sorting: true,
        name: 'type',
        title: 'Тип товара',
        xs: 2
    },
    {
        sorting: true,
        name: 'brand',
        title: 'Бренд',
        xs: 2
    },
    {
        sorting: true,
        name: 'measurement',
        title: 'Мера',
        xs: 2
    },
    {
        sorting: true,
        name: 'price',
        title: 'Цена',
        xs: 2
    },
    {
        sorting: true,
        name: 'action',
        title: '',
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

const ProductPriceGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        filterDialog,
        actionsDialog,
        confirmDialog,
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

    const productPriceFilterDialog = (
        <ProductPriceFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const productPriceDetail = (
        <span>a</span>
    )

    const productPriceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const brand = _.get(item, ['brand', 'name']) || 'N/A'
        const measurement = _.get(item, ['measurement', 'name']) || ''
        const price = _.get(item, 'price') || 'N/A'
        return (
            <Row key={id}>
                <Col xs={3}>{name}</Col>
                <Col xs={2}>{type}</Col>
                <Col xs={2}>{brand}</Col>
                <Col xs={2}>{measurement}</Col>
                <Col xs={2}>{price}</Col>
                <Col xs={1} style={{textAlign: 'right'}}>
                    <IconButton onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                        <Edit />
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: productPriceList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.PRODUCT_PRICE_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить продукт">
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
                detail={productPriceDetail}
                actionsDialog={actions}
                filterDialog={productPriceFilterDialog}
            />

            <ProductPriceCreateDialog
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
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

ProductPriceGridList.propTypes = {
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

export default ProductPriceGridList
