import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ManufactureAddStaffDialog from './ManufactureAddStaffDialog'
import ManufacturesList from './ManufacturesList'
import ManufactureShowBom from './ManufactureShowBom'
import ManufactureChangeDialog from './ManufactureChangeDialog'
import ManufactureAddProductDialog from './ManufactureAddProductDialog'
import ManufactureEditProductDialog from './ManufactureEditProductDialog'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import ManufactureTab from './ManufactureTab'
import ConfirmDialog from '../ConfirmDialog'

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
            margin: '0 -28px',
            height: 'calc(100vh - 60px)'
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

const ManufactureGridList = enhance((props) => {
    const {
        listData,
        detailData,
        showBom,
        classes,
        equipmentData,
        editMaterials,
        createMaterials,
        productData,
        tabData,
        productFilterDialog,
        personData,
        shipmentData,
        deleteMaterials
    } = props

    const ZERO = 0

    const productConfirm = _.get(productData, 'confirmDialog')
    const productCreate = _.get(productData, 'createDialog')
    const userCreate = _.get(personData, 'createDialog')
    const userUpdate = _.get(personData, 'updateDialog')
    const userConfirm = _.get(personData, 'confirmDialog')
    const productName = _.get(_.find(_.get(productData, 'productList'), {'id': _.toInteger(_.get(productData, ['detailData', 'id']))}), 'name')
    return (
        <Container>
            <ManufactureAddStaffDialog
                open={userCreate.open}
                onClose={userCreate.handleCloseDialog}
                onSubmit={userCreate.handleSubmitDialog}
            />
            <ManufactureAddStaffDialog
                isUpdate={true}
                initialValues={userUpdate.initialValues}
                open={userUpdate.open}
                onClose={userUpdate.handleCloseUpdateDialog}
                onSubmit={userUpdate.handleSubmitUpdateDialog}
            />
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

                <ManufactureTab
                    tabData={tabData}
                    editMaterials={editMaterials}
                    createMaterials={createMaterials}
                    deleteMaterials={deleteMaterials}
                    productData={productData}
                    personData={personData}
                    equipmentData={equipmentData}
                    shipmentData={shipmentData}
                    productFilterDialog={productFilterDialog}
                    handleCloseDetail={_.get(detailData, 'handleCloseDetail')}/>
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
            {_.get(personData, 'userShiftItem') && <ConfirmDialog
                type="delete"
                message={_.get(_.get(personData, ['userShiftItem', 'user']), 'firstName') +
                ' ' + _.get(_.get(personData, ['userShiftItem', 'user']), 'secondName')}
                onClose={userConfirm.handleCloseConfirmDialog}
                onSubmit={userConfirm.handleSendConfirmDialog}
                open={userConfirm.open}
            />}
        </Container>
    )
})

ManufactureGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    showBom: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        handleOpen: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired
    }).isRequired,
    productData: PropTypes.object.isRequired,
    personData: PropTypes.object.isRequired,
    equipmentData: PropTypes.object,
    tabData: PropTypes.object.isRequired,
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

export default ManufactureGridList
