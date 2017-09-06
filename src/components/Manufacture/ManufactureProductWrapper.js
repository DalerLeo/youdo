import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ManufacturesList from './ManufacturesList'
import ManufactureShowBom from './ManufactureShowBom'
import ManufactureChangeDialog from './ManufactureChangeDialog'
import ManufactureAddProductDialog from './ManufactureAddProductDialog'
import ManufactureEditProductDialog from './ManufactureEditProductDialog'
import Container from '../Container'
import ConfirmDialog from '../ConfirmDialog'
import Paper from 'material-ui/Paper'
import ManufactureProduct from './Tab/ManufactureProduct'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'

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
        productionMainRow: {
            paddingTop: '20px',
            margin: '0 -28px',
            height: 'calc(100vh - 20px)'
        },
        productionRightSide: {
            width: 'calc(100% - 280px)',
            padding: '0 28px'
        },
        tabWrapper: {
            display: 'flex',
            alignItems: 'center',
            '& > a': {
                fontWeight: 'inherit',
                color: 'inherit'
            }
        },
        tab: {
            height: '58px',
            lineHeight: '58px',
            padding: '0 20px',
            transition: 'all 300ms ease',
            cursor: 'pointer'
        },
        activeTab: {
            extend: 'tab',
            color: '#12aaeb',
            fontWeight: '600',
            borderBottom: '3px #12aaeb solid',
            cursor: 'default'
        },
        productList: {
            width: '100%',
            '& li': {
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '10px 0'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            },
            '& .dottedList:after': {
                left: '0.7em',
                right: '0.7em'
            }
        }
    })
)

const tabs = [
    {
        title: 'Продукция',
        url: ROUTES.MANUFACTURE_PRODUCT_LIST_URL
    },
    {
        title: 'Персонал',
        url: ROUTES.MANUFACTURE_PERSON_LIST_URL
    },
    {
        title: 'Оборудование',
        url: ROUTES.MANUFACTURE_EQUIPMENT_LIST_URL
    },
    {
        title: 'Партия',
        url: ROUTES.MANUFACTURE_SHIPMENT_LIST_URL
    }
]

const ManufactureProductWrapper = enhance((props) => {
    const {
        filter,
        listData,
        detailData,
        showBom,
        classes,
        editMaterials,
        createMaterials,
        productData,
        productFilterDialog,
        deleteMaterials
    } = props

    const ZERO = 0
    console.warn(filter.getParams())

    const productConfirm = _.get(productData, 'confirmDialog')
    const productCreate = _.get(productData, 'createDialog')
    const productName = _.get(_.find(_.get(productData, 'productList'), {'id': _.toInteger(_.get(productData, ['detailData', 'id']))}), 'name')
    return (
        <Container>
            <ManufactureShowBom
                open={showBom.open}
                onClose={showBom.handleClose}

            />
            <ManufactureAddProductDialog
                open={productCreate.open}
                onClose={productCreate.handleCloseCreateDialog}
                onSubmit={productCreate.handleSubmitCreateDialog}
            />
            <ManufactureEditProductDialog
                open={createMaterials.open}
                onClose={createMaterials.handleClose}
                onSubmit={createMaterials.handleSubmit}
            />
            <ManufactureEditProductDialog
                isUpdate={true}
                initialValues={editMaterials.initialValues}
                measurement={editMaterials.measurement}
                open={editMaterials.open}
                onClose={editMaterials.handleClose}
                onSubmit={editMaterials.handleSubmit}
            />
            <ManufactureChangeDialog
                open={_.get(productData, ['changeManufacture', 'open'])}
                onClose={_.get(productData, ['changeManufacture', 'handleCloseChangeManufacture'])}
                onSubmit={_.get(productData, ['changeManufacture', 'handleSubmitChangeManufacture'])}
            />

            <Row className={classes.productionMainRow}>
                <ManufacturesList listData={listData} detailData={detailData}/>

                <div className={classes.productionRightSide}>
                    <Paper zDepth={1} className={classes.tabWrapper}>
                        {
                            _.map(tabs, (tab, index) => {
                                const title = _.get(tab, 'title')
                                const url = _.get(tab, 'url')

                                return (
                                    <Link key={index} to={{pathname: url, query: ''}}>
                                        <div className={classes.tab}>
                                            <span>{title}</span>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </Paper>

                    <ManufactureProduct
                        productData={productData}
                        editMaterials={editMaterials}
                        filter={filter}
                        filterDialog={productFilterDialog}
                        createMaterials={createMaterials}
                        deleteMaterials={deleteMaterials}
                        handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
                    />
                </div>
            </Row>

            {_.get(deleteMaterials, 'open') !== false && <ConfirmDialog
                type="delete"
                open={deleteMaterials.open}
                message={_.get(deleteMaterials, 'name')}
                onClose={deleteMaterials.handleCloseConfirmDialog}
                onSubmit={deleteMaterials.handleSendConfirmDialog}
            />}
            {_.get(productData, ['detailData', 'id']) > ZERO && <ConfirmDialog
                type="delete"
                message={productName}
                onClose={productConfirm.handleCloseConfirmDialog}
                onSubmit={productConfirm.handleSendConfirmDialog}
                open={productConfirm.openConfirmDialog}
            />}
        </Container>
    )
})

ManufactureProductWrapper.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    showBom: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpen: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired
    }).isRequired,
    productData: PropTypes.object.isRequired,
    productFilterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    createMaterials: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpen: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired
    }),
    updateProductDialog: PropTypes.object
}

export default ManufactureProductWrapper
