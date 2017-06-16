import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import ManufactureAddStaffDialog from './ManufactureAddStaffDialog'
import ManufactureShowBom from './ManufactureShowBom'
import ManufactureChangeDialog from './ManufactureChangeDialog'
import ManufactureAddProductDialog from './ManufactureAddProductDialog'
import ManufactureEditProductDialog from './ManufactureEditProductDialog'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import ManufactureTab from './ManufactureTab'
import ConfirmDialog from '../ConfirmDialog'
import Glue from '../Images/glue.png'
import Cylindrical from '../Images/cylindrical.png'
import Press from '../Images/press.png'
import Cut from '../Images/cut.png'
import Badge from '../Images/badge.png'

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
            height: 'calc(100vh - 60px)',
            overflowY: 'auto'
        },
        productionLeftSide: {
            padding: '0'
        },
        productionRightSide: {
            background: '#fff',
            padding: '0 30px',
            '& .row:first-child img': {
                width: '18px',
                height: '18px',
                marginRight: '10px'
            }
        },
        productionUl: {
            listStyle: 'none',
            margin: '0',
            padding: '0',
            minHeight: 'calc(100% - 59px)',
            borderRight: '1px #efefef solid'
        },
        productionStaffUl: {
            extend: 'productionUl',
            '& .dottedList': {
                margin: '0',
                padding: '10px 0 10px 0',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '& div:first-child': {
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    borderRadius: '50%',
                    marginRight: '10px',
                    overflow: 'hidden'
                },
                '& div:first-child img': {
                    width: '30px'
                },
                '& div:last-child': {
                    display: 'inline-block',
                    verticalAlign: 'top'
                },
                '& div:last-child span': {
                    color: '#666'
                }
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        },
        productionTypeLi: {
            background: '#f2f5f8',
            margin: '0',
            padding: '20px 30px',
            borderBottom: '1px solid #efefef',
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            cursor: 'pointer',
            '& img': {
                width: '24px',
                height: '24px',
                marginRight: '10px'
            }
        },
        productionH2: {
            fontSize: '13px',
            fontWeight: 'bold',
            margin: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px'
        },
        productionRightH2: {
            fontSize: '13px',
            fontWeight: '800',
            margin: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 0',
            display: 'flex',
            alignItems: 'center'
        },

        productionStaffGroupTitle: {
            margin: '0',
            '& .dottedList': {
                padding: '20px 0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                '& p': {
                    margin: '0',
                    fontWeight: '600 !important'
                },
                '& span': {
                    color: '#999',
                    fontSize: '12px !important'
                }
            }
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
        },
        deleteHideIco: {
            display: 'none',
            position: 'absolute',
            right: '0'
        },
        productionEquipment: {
            padding: '20px 0',
            borderBottom: '1px solid #efefef'
        },
        productionEquipmentElement: {
            background: '#f2f5f8',
            textAlign: 'center',
            padding: '20px 30px'
        },
        workerWrap: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            position: 'relative',
            '&:hover > div:last-child': {
                display: 'flex'
            }
        },
        workerAvatar: {
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            marginRight: '10px',
            overflow: 'hidden',
            '& img': {
                width: '100%',
                height: '100%'
            }
        },
        workerPosition: {
            '& span': {
                display: 'block',
                color: '#666',
                fontSize: '11px !important'
            }
        },
        tabNav: {
            padding: '15px 0',
            borderBottom: '1px #f2f5f8 solid',
            '& a': {
                margin: '-15px 0',
                padding: '15px 0',
                marginRight: '40px',
                color: '#9b9b9b',
                '&.active': {
                    color: '#12aaeb',
                    borderBottom: '1px solid'
                }
            }
        },
        tabContent: {
            '& .row:first-child': {
                fontWeight: '600'
            },
            '& .row': {
                '& > div:first-child': {
                    textAlign: 'left'
                }
            }
        },
        tabWrapper: {
            overflowY: 'auto',
            overflowX: 'hidden',
            height: 'calc(100vh - 120px)'
        },
        tableHeaderPN: {
            width: '100%',
            display: 'flex',
            borderBottom: '1px solid #efefef',
            height: '60px',
            alignItems: 'center'
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
        deleteMaterials
    } = props

    const detailId = _.get(detailData, 'id')
    const glue = 3
    const cylindrical = 4
    const press = 6
    const cut = 7
    const badge = 8
    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        return (
            <li key={id} className={classes.productionTypeLi}
                onTouchTap={() => {
                    listData.handleClickItem(id)
                }}
                style={ detailId === id ? {backgroundColor: 'white'} : {}}>
                { id === glue ? <img src={Glue}/> : (
                    id === cylindrical ? <img src={Cylindrical}/> : (
                        id === press ? <img src={Press}/> : (
                            id === cut ? <img src={Cut}/> : (
                                id === badge ? <img src={Badge}/> : '')
                        )
                    )
                )}

                {name}
            </li>
        )
    })
    const MINUS_ONE = -1

    const productConfirm = _.get(productData, 'confirmDialog')
    const productCreate = _.get(productData, 'createDialog')
    const productUpdate = _.get(productData, 'updateDialog')
    const userCreate = _.get(personData, 'createDialog')
    const userUpdate = _.get(personData, 'updateDialog')
    const userConfirm = _.get(personData, 'confirmDialog')
    const productName = _.get(_.find(_.get(productData, 'productList'), {'id': _.toInteger(_.get(productData, ['detailData', 'id']))}), 'name')
    return (
        <Container>
            <SubMenu url={ROUTES.MANUFACTURE_CUSTOM_URL}/>
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
                onSubmit={productData.handleSubmitAddIngredient}
                onClose={showBom.handleClose}

            />
            <ManufactureAddProductDialog
                open={productCreate.open}
                onClose={productCreate.handleCloseCreateDialog}
                onSubmit={productCreate.handleSubmitCreateDialog}
            />
            <ManufactureAddProductDialog
                initialValues={productUpdate.initialValues}
                open={productUpdate.open}
                onClose={productUpdate.handleCloseUpdateDialog}
                onSubmit={productUpdate.handleSubmitUpdateDialog}
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
                <Col xs={3} className={classes.productionLeftSide}>
                    <h2 className={classes.productionH2}>Этапы производства</h2>
                    <ul className={classes.productionUl}>
                        {
                            _.get(listData, 'listLoading')
                                ? <div style={{textAlign: 'center'}}>
                                <CircularProgress size={100} thickness={6}/>
                            </div>
                                : manufactureList
                        }
                    </ul>
                </Col>
                <ManufactureTab
                    tabData={tabData}
                    editMaterials={editMaterials}
                    createMaterials={createMaterials}
                    deleteMaterials={deleteMaterials}
                    productData={productData}
                    personData={personData}
                    equipmentData={equipmentData}
                    productFilterDialog={productFilterDialog}/>
            </Row>

            {_.get(deleteMaterials, 'open') !== false && <ConfirmDialog
                type="delete"
                open={deleteMaterials.open}
                message={_.get(deleteMaterials, 'name')}
                onClose={deleteMaterials.handleCloseConfirmDialog}
                onSubmit={deleteMaterials.handleSendConfirmDialog}
            />}
            {_.get(productData, ['detailData', 'id']) !== MINUS_ONE && <ConfirmDialog
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
