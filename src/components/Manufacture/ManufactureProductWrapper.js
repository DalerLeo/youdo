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
import ManufactureTabs from './ManufactureTabs'
import Container from '../Container'
import ConfirmDialog from '../ConfirmDialog'
import ManufactureProduct from './Tab/ManufactureProduct'
import * as ROUTES from '../../constants/routes'

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
            height: '100vh'
        },
        productionRightSide: {
            width: 'calc(100% - 280px)',
            marginTop: '-20px',
            padding: '20px 30px',
            overflowY: 'auto'
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

const ManufactureProductWrapper = enhance((props) => {
    const {
        filterProduct,
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
                    <ManufactureTabs currentURL={ROUTES.MANUFACTURE_PRODUCT_LIST_URL}/>

                    <ManufactureProduct
                        productData={productData}
                        editMaterials={editMaterials}
                        filter={filterProduct}
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
