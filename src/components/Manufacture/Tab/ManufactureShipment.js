import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {hashHistory, Link} from 'react-router'
import {compose, withState} from 'recompose'
import Filter from 'material-ui/svg-icons/content/filter-list'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Sort from 'material-ui/svg-icons/content/sort'
import Log from 'material-ui/svg-icons/content/content-paste'
import Shift from 'material-ui/svg-icons/av/loop'
import BeenHere from 'material-ui/svg-icons/maps/beenhere'
import InventoryIcon from 'material-ui/svg-icons/notification/event-note'
import Raw from 'material-ui/svg-icons/action/exit-to-app'
import Product from '../../CustomIcons/Product'
import {Field, reduxForm} from 'redux-form'
import ManufactureActivityDateRange from '../ManufactureActivityDateRange'
import ManufactureActivityFilterDialog from '../ManufactureActivityFilterDialog'
import ManufactureAddProductMaterial from '../ManufactureAddProductMaterial'
import ShipmentAddProductsDialog from '../ShipmentAddProductsDialog'
import ConfirmDialog from '../../ConfirmDialog'
import Choose from '../../Images/choose-menu.png'
import NotFound from '../../Images/not-found.png'
import * as ROUTES from '../../../constants/routes'
import {INVENTORY_INVENTORY_DIALOG_OPEN} from '../../Inventory'
import numberFormat from '../../../helpers/numberFormat'
import {ShiftMultiSearchField, ManufactureLogTypeSearchField, UsersSearchField} from '../../ReduxForm'
import * as TAB from '../../../constants/manufactureShipmentTab'
import ShipmentConfirmDialog from '../../../components/Manufacture/ShipmentConfirmDialog'
import CloseIcon from 'material-ui/svg-icons/navigation/cancel'
import t from '../../../helpers/translate'
import toBoolean from '../../../helpers/toBoolean'
import {TYPE_PRODUCT, TYPE_RAW} from '../index'
import {CustomTabs} from '../../CustomTabs'
import ShipmentInventoryTab from './ShipmentInventoryTab'
import ShipmentShiftTab from './ShipmentShiftTab'
import ShipmentReviewTab from './ShipmentReviewTab'
import ShipmentLogsTab from './ShipmentLogsTab'
const ZERO = 0
export const MANUFACTURES_FILTERS_KEY = {
    SHIFT: 'shift',
    TYPE: 'type',
    STAFF: 'staff'
}

const enhance = compose(
    injectSheet({
        buttons: {
            display: 'flex',
            margin: '10px 0',
            justifyContent: 'flex-end',
            '& > a': {
                marginLeft: '10px !important',
                '& > button': {
                    marginLeft: '10px !important',
                    '& svg': {
                        verticalAlign: 'text-top !important',
                        width: '20px !important',
                        height: '20px !important'
                    }
                }
            },
            '& > button': {
                marginLeft: '10px !important',
                '& svg': {
                    verticalAlign: 'text-top !important',
                    width: '20px !important',
                    height: '20px !important'
                }
            }
        },
        shipmentContent: {
            position: 'relative',
            '& header': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '65px',
                padding: '0 30px',
                borderBottom: '1px #efefef solid',
                '& > div': {
                    fontSize: '18px',
                    fontWeight: '600'
                }
            }
        },
        loader: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '56px',
            padding: '100px 0'
        },
        load: {
            display: 'flex',
            alignItems: 'center'
        },
        miniLoader: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '25px 0'
        },
        choose: {
            background: 'url(' + Choose + ') no-repeat center 50px',
            backgroundSize: '200px',
            marginTop: '20px',
            padding: '245px 0 30px',
            textAlign: 'center',
            fontSize: '15px',
            color: '#666 !important'
        },
        filterBtn: {
            background: '#12aaeb',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            padding: '5px 15px'
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        },
        leftSide: {
            width: '100%',
            borderRight: '1px #efefef solid'
        },
        infoBlock: {
            padding: '15px 30px',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                border: 'none'
            },
            '& ul li': {
                marginBottom: '5px',
                '& > span:last-child': {
                    marginLeft: '5px',
                    fontWeight: '600'
                }
            }
        },
        rightSide: {
            width: '100%',
            position: 'relative',
            '& > div > div': {
                '&:nth-child(1)': {
                    paddingRight: 'calc(100% - 620px)'
                }
            }
        },
        tabWrapper: {
            borderTop: '1px #efefef solid',
            marginTop: '-1px'
        },
        tab: {
            textTransform: 'none !important'
        },
        flexReview: {
            '& > div': {
                width: '100%',
                '&:last-child': {
                    borderRight: 'none'
                }
            }
        },
        productsBlock: {
            padding: '15px 30px',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                borderBottom: 'none'
            },
            '& h4': {
                fontWeight: '600',
                marginBottom: '5px',
                fontSize: '13px'
            }
        },
        flexTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            '& h4': {
                fontWeight: '600',
                fontSize: '13px'
            },
            '& > div:last-child': {
                textAlign: 'right'
            }
        },
        flexTitleShift: {
            extend: 'flexTitle',
            '& > div': {
                textAlign: 'right',
                '&:first-child': {
                    textAlign: 'left'
                }
            }
        },
        product: {
            display: 'flex',
            alignItems: 'center',
            height: '45px',
            padding: '5px 0',
            justifyContent: 'space-between',
            '& span': {
                display: 'flex',
                alignItems: 'center',
                '& svg': {
                    marginRight: '5px'
                }
            },
            '& > div:last-child': {
                textAlign: 'right'
            },
            '&:hover': {
                background: '#f2f5f8',
                '& div': {
                    opacity: '1'
                }
            }
        },
        productAmount: {
            '& span': {
                display: 'inline-block',
                marginLeft: '5px'
            }
        },
        shift: {
            extend: 'product',
            borderRadius: '2px',
            cursor: 'pointer',
            padding: '8px 0',
            position: 'relative',
            '&:hover': {
                background: '#f2f5f8'
            },
            '& > div': {
                textAlign: 'right',
                '&:first-child': {
                    textAlign: 'left'
                },
                '&:nth-child(2)': {
                    textAlign: 'left'
                }
            }
        },
        inventory: {
            extend: 'product',
            borderRadius: '2px',
            padding: '8px 0',
            '&:hover': {
                background: '#f2f5f8',
                cursor: 'pointer'
            },
            '& > div': {
                textAlign: 'right',
                '&:first-child': {
                    textAlign: 'left'
                },
                '&:nth-child(2)': {
                    textAlign: 'left'
                }
            }
        },
        productReview: {
            extend: 'product',
            borderRadius: '2px',
            '&:hover': {
                background: '#f2f5f8'
            }
        },
        productDefected: {
            extend: 'product',
            background: '#ffebee',
            borderRadius: '2px',
            color: '#f44336',
            '&:hover': {
                background: '#f2f5f8'
            }
        },
        pagination: {
            position: 'absolute',
            display: 'flex',
            height: '48px',
            top: '-55px',
            right: '150px'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '175px',
            padding: '140px 0 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        actionButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            opacity: '0',
            transitions: 'opacity 200ms ease'
        }
    }),
    reduxForm({
        form: 'LogEditForm',
        enableReinitialize: true
    }),
    withState('deleteItem', 'setDeleteItem', null)
)

const iconStyles = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    clearButton: {
        width: 23,
        height: 23,
        padding: 0,
        position: 'absolute',
        borderRadius: '100%',
        backgroundColor: '#fff',
        right: '20px',
        top: '5px'
    },
    clearIcon: {
        color: '#888',
        width: 23,
        height: 23
    },
    filterIcon: {
        color: '#fff',
        width: 18
    }
}

const flatButtonStyle = {
    reconciliationColor: '#ff7373',
    verifyColor: '#FF8A65',
    productColor: '#4db6ac',
    rawColor: '#12aaeb',
    labelStyle: {
        color: '#fff',
        fontWeight: '600',
        verticalAlign: 'baseline',
        textTransform: 'none'
    }
}
const ManufactureShipment = enhance((props) => {
    const {
        filterLogs,
        filterDialog,
        tabData,
        shipmentData,
        classes,
        manufactureId,
        productMaterialDialog,
        addProductDialog,
        handleEditProductAmount,
        deleteItem,
        setDeleteItem,
        handleDeleteProduct,
        sendDialog,
        stock,
        filterInventory
    } = props
    const filter = _.get(shipmentData, 'filter')
    const tab = _.get(tabData, 'tab')
    const detailData = _.get(shipmentData, 'detailData')
    const shipmentList = _.get(shipmentData, 'shipmentList')
    const shiftsLoading = _.get(shipmentData, 'listLoading')
    const logsLoading = _.get(detailData, 'logsLoading')
    const editlogsLoading = _.get(detailData, 'editlogsLoading')
    const productsLoading = _.get(detailData, 'productsLoading')
    const materialsLoading = _.get(detailData, 'materialsLoading')
    const inventoryLoading = _.get(detailData, 'inventoryLoading')

    const handleOpenDelete = (item, type, id) => {
        setDeleteItem(item)
        hashHistory.push(filter.createURL({openType: type, openId: id}))
    }
    const handleCloseDelete = () => {
        setDeleteItem(null)
    }
    const handleDeleteSubmit = () => {
        handleDeleteProduct()
        setDeleteItem(null)
        return null
    }

    const groupedProducts = _.groupBy(_.get(detailData, 'products'), (item) => item.product.id)
    const selectedShiftId = _.toInteger(filter.getParam('openShift'))
    const selectedShift = _.find(shipmentList, {'id': selectedShiftId})
    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="shift"
                component={ShiftMultiSearchField}
                label={t('Смена')}
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="staff"
                component={UsersSearchField}
                label={t('Работник')}
                fullWidth={true}/>
            {!_.isEmpty(_.get(detailData, 'logs')) && <Field
                className={classes.inputFieldCustom}
                name="type"
                component={ManufactureLogTypeSearchField}
                label={t('Тип')}
                fullWidth={true}/>}
        </div>
    )
    if (manufactureId <= ZERO) {
        return (
            <Paper transitionEnabled={false} zDepth={1} className={classes.choose}>
                <div>{t('Выберите производство')}...</div>
            </Paper>
        )
    }

    const getFilterCount = (filterKeys) => {
        return _(filterKeys)
            .values()
            .filter(item => item !== filterKeys.FROM_DATE && item !== filterKeys.SEARCH)
            .filter(item => filter.getParam(item))
            .value()
            .length
    }
    const filterCount = getFilterCount(MANUFACTURES_FILTERS_KEY)
    const filtered = toBoolean(filterCount > ZERO)

    const tabular = [
        {
            name: t('Обзор'),
            key: TAB.TAB_SORTED,
            icon: <Sort style={iconStyles.icon}/>
        },
        {
            name: t('Записи'),
            key: TAB.TAB_LOGS,
            icon: <Log style={iconStyles.icon}/>
        },
        {
            name: t('Смены'),
            key: TAB.TAB_SHIFT,
            icon: <Shift style={iconStyles.icon}/>
        },
        {
            name: t('Инвентаризация'),
            key: TAB.TAB_INVENTORY,
            icon: <InventoryIcon style={iconStyles.icon}/>
        }
    ]

    return (
        <div>
            <div className={classes.buttons}>
                <Link
                    target={'_blank'}
                    to={{
                        pathname: ROUTES.INVENTORY_LIST_URL,
                        query: {[INVENTORY_INVENTORY_DIALOG_OPEN]: true, 'pdStock': stock}
                    }}
                    className={classes.link}>
                    <FlatButton
                        label={t('Сверить')}
                        labelStyle={flatButtonStyle.labelStyle}
                        backgroundColor={flatButtonStyle.verifyColor}
                        hoverColor={flatButtonStyle.verifyColor}
                        rippleColor={'#fff'}
                        icon={<BeenHere color={'#fff'}/>}
                    />
                </Link>
                <FlatButton
                    label={t('Добавить продукт')}
                    labelStyle={flatButtonStyle.labelStyle}
                    backgroundColor={flatButtonStyle.productColor}
                    hoverColor={flatButtonStyle.productColor}
                    rippleColor={'#fff'}
                    onTouchTap={() => {
                        productMaterialDialog.handleOpen(TYPE_PRODUCT)
                    }}
                    icon={<Product color={'#fff'}/>}
                />
                <FlatButton
                    label={t('Добавить сырье')}
                    labelStyle={flatButtonStyle.labelStyle}
                    backgroundColor={flatButtonStyle.rawColor}
                    hoverColor={flatButtonStyle.rawColor}
                    rippleColor={'#fff'}
                    onTouchTap={() => {
                        productMaterialDialog.handleOpen(TYPE_RAW)
                    }}
                    icon={<Raw color={'#fff'}/>}
                />
            </div>
            <Paper transitionEnabled={false} zDepth={1} className={classes.shipmentContent}>
                <header>
                    <ManufactureActivityDateRange filter={filter} initialValues={filterDialog.initialValues}/>

                    <a className={classes.filterBtn} onClick={filterDialog.handleOpenFilterDialog}>
                        <Filter style={iconStyles.filterIcon}/>
                        <span>{t('Фильтр') + (filtered ? ' / ' + filterCount : '')}</span>
                    </a>

                    {filtered &&
                    <IconButton
                        iconStyle={iconStyles.clearIcon}
                        style={iconStyles.clearButton}
                        onTouchTap={() => filterDialog.handleClearFilterDialog()}>
                            <CloseIcon />
                    </IconButton>}
                </header>
                <ManufactureActivityFilterDialog
                    filterDialog={filterDialog}
                    fields={fields}
                    initialValues={filterDialog.initialValues}/>
                <div className={classes.details}>
                    <div className={classes.rightSide}>
                        <CustomTabs
                            tabs={tabular}
                            value={tab}
                            mainClassName={classes.tabWrapper}
                            onChangeTab={(value) => tabData.handleTabChange(value)}>
                            <ShipmentReviewTab
                                key={TAB.TAB_SORTED}
                                data={{
                                    groupedProducts,
                                    products: _.get(detailData, 'products'),
                                    materials: _.get(detailData, 'materials')
                                }}
                                loading={{productsLoading, materialsLoading}}
                                filter={filter}
                                classes={classes}/>
                            <ShipmentLogsTab
                                key={TAB.TAB_LOGS}
                                classes={classes}
                                list={_.get(detailData, 'logs')}
                                filter={filterLogs}
                                loading={logsLoading}
                                dispatch={props.dispatch}
                                editLoading={editlogsLoading}
                                handleOpenDelete={handleOpenDelete}
                                handleEditProductAmount={handleEditProductAmount}
                            />
                            <ShipmentShiftTab
                                key={TAB.TAB_SHIFT}
                                list={shipmentList}
                                loading={shiftsLoading}
                                filter={filter}
                                classes={classes}
                                handleSendOpenDialog={sendDialog.handleOpen}
                            />
                            <ShipmentInventoryTab
                                key={TAB.TAB_INVENTORY}
                                data={_.get(detailData, 'inventory')}
                                loading={inventoryLoading}
                                filter={filterInventory}
                                classes={classes}/>
                        </CustomTabs>
                    </div>
                </div>
            </Paper>

            <ManufactureAddProductMaterial
                type={productMaterialDialog.type}
                open={productMaterialDialog.open}
                onClose={productMaterialDialog.handleClose}
                onSubmit={productMaterialDialog.handleSubmit}
                handleOpenAddProduct={addProductDialog.handleOpenAddProduct}
                manufacture={manufactureId}
            />

            <ShipmentAddProductsDialog
                type={productMaterialDialog.type}
                filter={addProductDialog.filter}
                data={addProductDialog.data}
                open={addProductDialog.openAddProductDialog}
                onClose={addProductDialog.handleCloseAddProduct}
                onSubmit={addProductDialog.handleSubmitAddProduct}
                loading={addProductDialog.loading}
                openAddProductConfirm={addProductDialog.openAddProductConfirm}
                handleCloseAddProductConfirm={addProductDialog.handleCloseAddProductConfirm}
                handleSubmitAddProductConfirm={addProductDialog.handleSubmitAddProductConfirm}
            />

            <ConfirmDialog
                type="delete"
                message={_.get(deleteItem, ['product', 'name']) + ' ' + numberFormat(_.get(deleteItem, 'amount'), _.get(deleteItem, ['product', 'measurement', 'name']))}
                onClose={handleCloseDelete}
                open={_.toInteger(_.get(deleteItem, 'id')) > ZERO}
                onSubmit={handleDeleteSubmit}
            />

            <ShipmentConfirmDialog
                type="submit"
                message={_.get(selectedShift, ['user', 'firstName']) + ' ' + _.get(selectedShift, ['user', 'secondName'])}
                onClose={sendDialog.handleClose}
                open={sendDialog.open}
                onSubmit={sendDialog.handleSubmit}
            />
        </div>
    )
})

export default ManufactureShipment
