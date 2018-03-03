import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import sprintf from 'sprintf'
import injectSheet from 'react-jss'
import {hashHistory, Link} from 'react-router'
import {compose, withState} from 'recompose'
import Filter from 'material-ui/svg-icons/content/filter-list'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Sort from 'material-ui/svg-icons/content/sort'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import Log from 'material-ui/svg-icons/content/content-paste'
import Shift from 'material-ui/svg-icons/av/loop'
import BeenHere from 'material-ui/svg-icons/maps/beenhere'
import InventoryIcon from 'material-ui/svg-icons/notification/event-note'
import Raw from 'material-ui/svg-icons/action/exit-to-app'
import Product from '../../CustomIcons/Product'
import Material from 'material-ui/svg-icons/maps/layers'
import {Field, reduxForm, change} from 'redux-form'
import Defected from 'material-ui/svg-icons/image/broken-image'
import Check from 'material-ui/svg-icons/navigation/check'
import Person from 'material-ui/svg-icons/social/person'
import SendIcon from 'material-ui/svg-icons/content/reply-all'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import ManufactureActivityDateRange from '../ManufactureActivityDateRange'
import ManufactureActivityFilterDialog from '../ManufactureActivityFilterDialog'
import ManufactureAddProductMaterial from '../ManufactureAddProductMaterial'
import ShipmentAddProductsDialog from '../ShipmentAddProductsDialog'
import ConfirmDialog from '../../ConfirmDialog'
import Pagination from '../../GridList/GridListNavPagination'
import Choose from '../../Images/choose-menu.png'
import NotFound from '../../Images/not-found.png'
import * as ROUTES from '../../../constants/routes'
import {INVENTORY_INVENTORY_DIALOG_OPEN} from '../../Inventory'
import dateTimeFormat from '../../../helpers/dateTimeFormat'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {ShiftMultiSearchField, TextField, normalizeNumber, ManufactureLogTypeSearchField, UsersSearchField} from '../../ReduxForm'
import * as TAB from '../../../constants/manufactureShipmentTab'
import ShipmentConfirmDialog from '../../../components/Manufacture/ShipmentConfirmDialog'
import CloseIcon from 'material-ui/svg-icons/navigation/cancel'
import t from '../../../helpers/translate'
import toBoolean from '../../../helpers/toBoolean'
import {TYPE_PRODUCT, TYPE_RAW} from '../index'
import {CustomTabs} from '../../CustomTabs'

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
                },
                '&:nth-child(2)': {
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
    withState('edit', 'setEdit', null),
    withState('deleteItem', 'setDeleteItem', null)
)

const iconStyles = {
    product: {
        width: 20,
        height: 20,
        color: '#81c784'
    },
    material: {
        width: 20,
        height: 20,
        color: '#999'
    },
    defected: {
        width: 20,
        height: 20,
        color: '#e57373'
    },
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
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
    user: {
        marginRight: '5px',
        color: '#888',
        width: 22,
        height: 22
    },
    filterIcon: {
        color: '#fff',
        width: 18
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
        edit,
        handleEditProductAmount,
        setEdit,
        deleteItem,
        setDeleteItem,
        handleDeleteProduct,
        sendDialog,
        stock
    } = props
    const filter = _.get(shipmentData, 'filter')
    const PRODUCT = 'return'
    const MATERIAL = 'material'
    const tab = _.get(tabData, 'tab')
    const openID = _.toInteger(filter.getParam('openId'))
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
    const handleEdit = (type, id) => {
        props.dispatch(change('LogEditForm', 'editAmount', ''))
        setEdit(id)
        hashHistory.push(filter.createURL({openType: type, openId: id}))
    }
    const handleSubmit = () => {
        setEdit(null)
        handleEditProductAmount()
        props.dispatch(change('LogEditForm', 'editAmount', ''))
    }
    const handleOpenInventory = () => {
        setEdit(null)
        handleEditProductAmount()
        props.dispatch(change('LogEditForm', 'editAmount', ''))
    }
    const handleDeleteSubmit = () => {
        handleDeleteProduct()
        setDeleteItem(null)
        return null
    }
    const handleClickInventoryItem = (id) => {
        hashHistory.push({
            pathname: sprintf(ROUTES.INVENTORY_ITEM_PATH, id)
        })
    }
    const handleFilterByRotation = (staff, shift) => {
        hashHistory.push(filter.createURL({staff, shift}))
    }
    const groupedProducts = _.groupBy(_.get(detailData, 'products'), (item) => item.product.id)
    const products = _.map(groupedProducts, (item, index) => {
        const productName = _.get(_.find(_.get(detailData, 'products'), (obj) => {
            return _.toInteger(obj.product.id) === _.toInteger(index)
        }), ['product', 'name'])
        const totalAmount = _.sumBy(item, (o) => _.toNumber(_.get(o, 'totalAmount')))
        const totalMeasurement = _.get(_.first(item), ['measurement', 'name'])
        const defected = _.filter(item, (o) => _.get(o, 'isDefect'))
        const defectedAmount = _.get(_.first(defected), 'totalAmount')

        return (
            <Row key={index} className={classes.productReview}>
                <Col xs={6}>{productName}</Col>
                <Col xs={2}>{numberFormat(totalAmount, totalMeasurement)}</Col>
                <Col xs={2}>{_.map(_.filter(item, (o) => {
                    return !_.get(o, 'isDefect')
                }), (o, i) => {
                    const measurement = _.get(o, ['measurement', 'name'])
                    const amount = _.get(o, 'totalAmount')
                    return (
                        <span key={index + '_' + i}>{numberFormat(amount, measurement)}</span>
                    )
                })}</Col>
                <Col xs={2}>
                    {_.isEmpty(defected) ? numberFormat('0', totalMeasurement) : numberFormat(defectedAmount, totalMeasurement)}
                </Col>
            </Row>
        )
    })
    const materials = _.map(_.filter(_.get(detailData, 'materials'), (item) => {
        return !_.get(item, 'isDefect')
    }), (item, index) => {
        const measurement = _.get(item, ['measurement', 'name'])
        const product = _.get(item, ['product', 'name'])
        const amount = _.get(item, 'totalAmount')
        return (
            <Row key={index} className={classes.productReview}>
                <Col xs={6}>{product}</Col>
                <Col xs={6}>{numberFormat(amount, measurement)}</Col>
            </Row>
        )
    })
    const logs = _.map(_.get(detailData, 'logs'), (item, index) => {
        const measurement = _.get(item, ['product', 'measurement', 'name'])
        const product = _.get(item, ['product', 'name'])
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
        const amount = _.get(item, 'amount')
        const type = _.get(item, 'type')
        const id = _.get(item, 'id')
        const kind = _.get(item, 'kind')
        const isDefect = _.get(item, 'isDefect')
        const userName = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'firstName'])
        const isTransferred = _.get(item, ['personalRotation', 'isTransferred'])
        return (
            <Row key={index} className={isDefect ? classes.productDefected : classes.product}>
                <Col xs={4} style={{display: 'flex'}}>
                    <ToolTip position="left" text={'Создал: ' + userName}>
                        <Person style={iconStyles.user}/>
                    </ToolTip>
                {type === PRODUCT
                    ? <span>
                        {isDefect
                            ? <ToolTip position="left" text={t('Брак')}><Defected style={iconStyles.defected}/></ToolTip>
                            : kind === MATERIAL
                                ? <Material style={iconStyles.material}/>
                                : <Product style={iconStyles.product}/>
                        }
                        {product}
                        </span>
                    : <span>
                            <ToolTip position="left" text={t(isDefect ? 'Брак' : '')}>
                                <Raw style={isDefect ? iconStyles.defected : iconStyles.material}/>
                            </ToolTip>
                            {product}
                        </span>}
                </Col>
                <Col xs={2}>
                    {type === PRODUCT
                        ? (kind === MATERIAL)
                            ? t('Материал')
                            : t('Продукт')
                        : t('Сырье')}
                </Col>
                {edit === id
                    ? <Col xs={2}>
                        <Field
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                            component={TextField}
                            name={'editAmount'}
                            normalize={normalizeNumber}
                            hintText={numberFormat(amount, measurement)}/>
                    </Col>
                    : <Col xs={2}>
                        {editlogsLoading && (openID === id)
                            ? <div className={classes.load}><Loader size={0.5}/></div>
                            : numberFormat(amount, measurement)}
                    </Col>}
                <Col xs={4} style={{position: 'relative', paddingRight: '78px'}}>{createdDate}
                    <div style={{position: 'absolute', top: '-5px', right: '0'}}>
                        {edit === id
                            ? <div>
                                <IconButton
                                    iconStyle={iconStyles.icon}
                                    style={iconStyles.button}
                                    disableTouchRipple={true}
                                    onTouchTap={handleSubmit}>
                                    <Check color="#12aaeb"/>
                                </IconButton>
                            </div>
                            : <div className={classes.actionButtons}>
                                <ToolTip position="bottom" text={isTransferred ? t('Уже передан') : t('Изменить')}>
                                    <IconButton
                                        iconStyle={iconStyles.icon}
                                        disabled={isTransferred}
                                        style={iconStyles.button}
                                        disableTouchRipple={true}
                                        onTouchTap={() => handleEdit(type, id)}
                                        touch={true}>
                                        <EditIcon/>
                                    </IconButton>
                                </ToolTip>
                                <ToolTip position="bottom" text={isTransferred ? t('Уже передан') : t('Удалить')}>
                                    <IconButton
                                        disableTouchRipple={true}
                                        disabled={isTransferred}
                                        iconStyle={iconStyles.icon}
                                        style={iconStyles.button}
                                        onTouchTap={() => handleOpenDelete(item, type, id)}
                                        touch={true}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ToolTip>
                            </div>}
                    </div>
                </Col>

            </Row>
        )
    })
    const selectedShiftId = _.toInteger(filter.getParam('openShift'))
    const selectedShift = _.find(shipmentList, {'id': selectedShiftId})
    const shifts = _.map(shipmentList, (item) => {
        const id = _.get(item, 'id')
        const shiftName = _.get(item, ['shift', 'name'])
        const shiftId = _.get(item, ['shift', 'id'])
        const openedTime = dateTimeFormat(_.get(item, 'openedTime'))
        const closedTime = _.get(item, 'closedTime') ? dateTimeFormat(_.get(item, 'closedTime')) : t('Не закончилась')
        const userName = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'firstName'])
        const userId = _.get(item, ['user', 'id'])
        const isTransferrred = _.get(item, 'isTransferred')
        return (
            <Row key={id} className={classes.shift} onClick={() => handleFilterByRotation(userId, shiftId)}>
                <Col xs={3}>{userName}</Col>
                <Col xs={2}>{shiftName}</Col>
                <Col xs={3}>{openedTime}</Col>
                <Col xs={3}>{closedTime}</Col>
                <Col xs={1}>
                    <div className={classes.actionButtons}>
                        <ToolTip position="bottom"
                                 text={isTransferrred ? t('Уже передан на склад') : t('Передать на склад')}>
                            <IconButton
                                iconStyle={iconStyles.icon}
                                disabled={isTransferrred}
                                style={iconStyles.button}
                                disableTouchRipple={true}
                                onTouchTap={() => sendDialog.handleOpen(id)}
                                touch={true}>
                                <SendIcon/>
                            </IconButton>
                        </ToolTip>
                    </div>
                </Col>
            </Row>
        )
    })
    const inventories = _.map(_.get(detailData, 'inventory'), (item) => {
        const id = _.get(item, 'id')
        const stockInventory = _.get(item, ['stock', 'name'])
        const createdBy = _.get(item, 'createdBy')
            ? _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName'])
            : 'Не указано'
        const createdDate = _.get(item, 'createdDate') ? dateFormat(_.get(item, 'createdDate')) : t('Не закончилась')
        const comment = _.get(item, 'comment') || 'Без комментариев'
        return (
            <Row key={id} className={classes.inventory} onTouchTap={() => { handleClickInventoryItem(id) }}>
                <Col xs={3}>{stockInventory}</Col>
                <Col xs={3}>{createdBy}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={3}>{comment}</Col>
            </Row>
        )
    })
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
                        onTouchTap={() => { handleOpenInventory() }}
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
                            <div
                                className={classes.tab}
                                key={TAB.TAB_SORTED}>
                                <div className={classes.flexReview}>
                                    <div className={classes.productsBlock}>
                                        <Row className={classes.flexTitle}>
                                            <Col xs={6}><h4>{t('Произведено')}</h4></Col>
                                            <Col xs={2}><h4>{t('Всего')}</h4></Col>
                                            <Col xs={2}><h4>{t('Ок')}</h4></Col>
                                            <Col xs={2}><h4>{t('Брак')}</h4></Col>
                                        </Row>
                                        {productsLoading
                                            ? <div className={classes.miniLoader}>
                                                <Loader size={0.75}/>
                                            </div>
                                            : !_.isEmpty(products)
                                                ? products
                                                : <div className={classes.emptyQuery}>
                                                    <div>{t('Продукции еще не произведены')}</div>
                                                </div>}
                                    </div>
                                    <div className={classes.productsBlock}>
                                        <Row className={classes.flexTitle}>
                                            <Col xs={6}><h4>{t('Затраченное сырье')}</h4></Col>
                                            <Col xs={2}><h4>{t('Кол-во')}</h4></Col>
                                        </Row>
                                        {materialsLoading
                                            ? <div className={classes.miniLoader}>
                                                <Loader size={0.75}/>
                                            </div>
                                            : !_.isEmpty(materials)
                                                ? materials
                                                : <div className={classes.emptyQuery}>
                                                    <div>{t('Не затрачено сырья')}</div>
                                                </div>}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={classes.tab}
                                key={TAB.TAB_LOGS}>
                                {!_.isEmpty(logs)
                                    ? <div className={classes.productsBlock}>
                                        <div className={classes.pagination}>
                                            <Pagination filter={filterLogs}/>
                                        </div>
                                        <Row className={classes.flexTitle}>
                                            <Col xs={4}><h4>{t('Продукт / сырье')}</h4></Col>
                                            <Col xs={2}><h4>{t('Тип')}</h4></Col>
                                            <Col xs={2}><h4>{t('Кол-во')}</h4></Col>
                                            <Col xs={4} style={{paddingRight: '78px'}}><h4>{t('Дата, время')}</h4></Col>
                                        </Row>
                                        {logsLoading
                                            ? <div className={classes.loader}>
                                                <Loader size={0.75}/>
                                            </div>
                                            : logs}
                                    </div>
                                    : logsLoading
                                        ? <div className={classes.loader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <div className={classes.emptyQuery}>
                                            <div>{t('Нет записей в данной смене')}</div>
                                        </div>}
                            </div>
                            <div
                                className={classes.tab}
                                key={TAB.TAB_SHIFT}>
                                {!_.isEmpty(shifts)
                                    ? <div className={classes.productsBlock}>
                                        <div className={classes.pagination}>
                                            <Pagination filter={filter}/>
                                        </div>
                                        <Row className={classes.flexTitleShift}>
                                            <Col xs={3}><h4>{t('Работник')}</h4></Col>
                                            <Col xs={2}><h4>{t('Смена')}</h4></Col>
                                            <Col xs={3}><h4>{t('Начало смены')}</h4></Col>
                                            <Col xs={3}><h4>{t('Конец смены')}</h4></Col>
                                            <Col xs={1}/>
                                        </Row>
                                        {shiftsLoading
                                            ? <div className={classes.loader}>
                                                <Loader size={0.75}/>
                                            </div>
                                            : shifts}
                                    </div>
                                    : shiftsLoading
                                        ? <div className={classes.loader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <div className={classes.emptyQuery}>
                                            <div>{t('В этом периоде не найдено смен')}</div>
                                        </div>}
                            </div>
                            <div
                                className={classes.tab}
                                key={TAB.TAB_INVENTORY}>
                                {!_.isEmpty(_.get(detailData, 'inventory'))
                                    ? <div className={classes.productsBlock}>
                                        <div className={classes.pagination}>
                                            <Pagination filter={filter}/>
                                        </div>
                                        <Row className={classes.flexTitleShift}>
                                            <Col xs={3}><h4>{t('Склад')}</h4></Col>
                                            <Col xs={3}><h4>{t('Создал')}</h4></Col>
                                            <Col xs={3}><h4>{t('Дата создания')}</h4></Col>
                                            <Col xs={3}><h4>{t('Комментарий')}</h4></Col>
                                        </Row>
                                        {inventoryLoading
                                            ? <div className={classes.loader}>
                                                <Loader size={0.75}/>
                                            </div>
                                            : inventories}
                                    </div>
                                    : inventoryLoading
                                        ? <div className={classes.loader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <div className={classes.emptyQuery}>
                                            <div>{t('В этом периоде не найдено смен')}</div>
                                        </div>}
                            </div>
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
