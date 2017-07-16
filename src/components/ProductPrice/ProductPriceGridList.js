import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import {reduxForm} from 'redux-form'
import {compose} from 'recompose'
import sprintf from 'sprintf'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import ProductPriceFilterForm from './ProductPriceFilterForm'
import ProductPriceCreateDialog from './ProductPriceCreateDialog'
import ProductPriceDetails from './ProductPriceDetails'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
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
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        openDetails: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '0',
            left: '0',
            margin: '0 -30px',
            cursor: 'pointer'
        }
    }),

    reduxForm({
        form: 'ProductPriceCreateForm',
        enableReinitialize: true
    })
)

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

const ProductPriceGridList = enhance((props) => {
    const {
        filter,
        updateDialog,
        filterDialog,
        handleOpenDetails,
        handleCloseDetails,
        priceDetailsOpen,
        listData,
        detailData,
        classes
    } = props
    const productPriceDetail = (
        <ProductPriceDetails
            key={_.get(detailData, 'id')}
            data={_.get(detailData, 'data') || {}}
            priceDetailsOpen={priceDetailsOpen}
            loading={_.get(detailData, 'detailLoading')}
            updateDialog={updateDialog}
            handleOpenDetails={handleOpenDetails}
            handleCloseDetails={handleCloseDetails}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
        />
    )

    const productPriceFilterDialog = (
        <ProductPriceFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const productPriceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const type = _.get(item, ['type', 'name']) || 'N/A'
        const brand = _.get(item, ['brand', 'name']) || 'N/A'
        const measurement = _.get(item, ['measurement', 'name']) || ''
        const price = _.get(item, 'price') || 'N/A'
        return (
            <Row key={id} style={{position: 'relative'}}>
                    <Link className={classes.openDetails} to={{
                        pathname: sprintf(ROUTES.PRODUCT_PRICE_ITEM_PATH, id),
                        query: ''
                    }}>
                    </Link>
                <Col xs={3}>
                    {name}
                </Col>
                <Col xs={2}>{type}</Col>
                <Col xs={2}>{brand}</Col>
                <Col xs={2}>{measurement}</Col>
                <Col xs={2}>{price}</Col>
                <Col xs={1} className={classes.buttons}>
                    <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}
                            touch={true}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
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

            <GridList
                filter={filter}
                list={list}
                detail={productPriceDetail}
                filterDialog={productPriceFilterDialog}
            />

            <ProductPriceCreateDialog
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />
        </Container>
    )
})

ProductPriceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
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
    }).isRequired
}

export default ProductPriceGridList
