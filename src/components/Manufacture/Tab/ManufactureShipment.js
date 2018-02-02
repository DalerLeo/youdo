import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Filter from 'material-ui/svg-icons/content/filter-list'
import * as TAB from '../../../constants/manufactureShipmentTab'
import ManufactureActivityDateRange from '../ManufactureActivityDateRange'
import ManufactureActivityFilterDialog from '../ManufactureActivityFilterDialog'
import ManufactureAddProductMaterial from '../ManufactureAddProductMaterial'
import ShipmentAddProductsDialog from '../ShipmentAddProductsDialog'
import Paper from 'material-ui/Paper'
import Loader from '../../Loader'
import {Tabs, Tab} from 'material-ui/Tabs'
import FlatButton from 'material-ui/FlatButton'
import Sort from 'material-ui/svg-icons/content/sort'
import Log from 'material-ui/svg-icons/content/content-paste'
import Shift from 'material-ui/svg-icons/av/loop'
import {Field} from 'redux-form'
import Raw from 'material-ui/svg-icons/action/exit-to-app'
import Product from '../../CustomIcons/Product'
import Material from 'material-ui/svg-icons/maps/layers'
import Defected from 'material-ui/svg-icons/image/broken-image'
import Pagination from '../../GridList/GridListNavPagination'
import Choose from '../../Images/choose-menu.png'
import NotFound from '../../Images/not-found.png'
import dateTimeFormat from '../../../helpers/dateTimeFormat'
import numberFormat from '../../../helpers/numberFormat'
import {ShiftMultiSearchField} from '../../ReduxForm'
import t from '../../../helpers/translate'
import {TYPE_PRODUCT, TYPE_RAW} from '../index'

const enhance = compose(
    injectSheet({
        buttons: {
            display: 'flex',
            margin: '10px 0',
            justifyContent: 'flex-end',
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
            overflow: 'hidden',
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
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            padding: '5px 15px',
            '& svg': {
                color: '#fff !important',
                width: '18px !important'
            }
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
                    paddingRight: 'calc(100% - 330px)'
                },
                '&:nth-child(2)': {
                    paddingRight: 'calc(100% - 330px)'
                }
            }
        },
        tabWrapper: {
            borderTop: '1px #efefef solid',
            marginTop: '-1px'
        },
        tab: {
            textTransform: 'none !important',
            '& > div': {
                flexDirection: 'row !important',
                height: '48px !important',
                '& svg': {
                    marginBottom: '0 !important',
                    marginRight: '5px',
                    width: '22px !important',
                    height: '22px !important'
                }
            }
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
            padding: '8px 0',
            '&:hover': {
                background: '#f2f5f8'
            },
            '& > div': {
                textAlign: 'right',
                '&:first-child': {
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
            color: '#f44336'
        },
        pagination: {
            position: 'absolute',
            display: 'flex',
            height: '48px',
            top: '-48px',
            right: '30px'
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
        }
    })
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
    }
}
const tabStyles = {
    ink: {
        background: '#12aaeb',
        margin: '0',
        height: '2px'
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
        addProductDialog
    } = props
    const ZERO = 0
    const filter = _.get(shipmentData, 'filter')
    const PRODUCT = 'return'
    const MATERIAL = 'material'
    const tab = _.get(tabData, 'tab')
    const detailData = _.get(shipmentData, 'detailData')
    const shipmentList = _.get(shipmentData, 'shipmentList')
    const shiftsLoading = _.get(shipmentData, 'listLoading')
    const logsLoading = _.get(detailData, 'logsLoading')
    const productsLoading = _.get(detailData, 'productsLoading')
    const materialsLoading = _.get(detailData, 'materialsLoading')
    const reviewLoading = productsLoading || materialsLoading

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
        const kind = _.get(item, 'kind')
        const isDefect = _.get(item, 'isDefect')
        return (
            <Row key={index} className={isDefect ? classes.productDefected : classes.product}>
                {type === PRODUCT
                    ? <Col xs={6}><span>
                        {isDefect
                            ? <Defected style={iconStyles.defected}/>
                            : kind === MATERIAL
                                ? <Material style={iconStyles.material}/>
                                : <Product style={iconStyles.product}/>
                        }
                        {product}
                        </span>
                    </Col>
                    : <Col xs={6}><span><Raw style={iconStyles.material}/>{product}</span></Col>}
                <Col xs={2}>
                    {type === PRODUCT
                        ? (kind === MATERIAL)
                            ? t('Материал')
                            : t('Продукт')
                        : t('Сырье')}
                </Col>
                <Col xs={2}>{numberFormat(amount, measurement)}</Col>
                <Col xs={2}>{createdDate}</Col>
            </Row>
        )
    })
    const shifts = _.map(shipmentList, (item) => {
        const id = _.get(item, 'id')
        const openedTime = dateTimeFormat(_.get(item, 'openedTime'))
        const closedTime = _.get(item, 'closedTime') ? dateTimeFormat(_.get(item, 'closedTime')) : t('Не закончилась')
        const userName = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'firstName'])
        return (
            <Row key={id} className={classes.shift}>
                <Col xs={6}>{userName}</Col>
                <Col xs={3}>{openedTime}</Col>
                <Col xs={3}>{closedTime}</Col>
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
        </div>
    )
    const wholeEmpty = _.isEmpty(products) && _.isEmpty(materials)
    if (manufactureId <= ZERO) {
        return (
            <Paper transitionEnabled={false} zDepth={1} className={classes.choose}>
                <div>{t('Выберите производство')}...</div>
            </Paper>
        )
    }
    const flatButtonStyle = {
        productColor: '#4db6ac',
        rawColor: '#12aaeb',
        labelStyle: {
            color: '#fff',
            fontWeight: '600',
            verticalAlign: 'baseline',
            textTransform: 'none'
        }
    }
    return (
        <div>
            <div className={classes.buttons}>
                <FlatButton
                    label={t('Добавить продукт')}
                    labelStyle={flatButtonStyle.labelStyle}
                    backgroundColor={flatButtonStyle.productColor}
                    hoverColor={flatButtonStyle.productColor}
                    rippleColor={'#fff'}
                    onTouchTap={() => { productMaterialDialog.handleOpen(TYPE_PRODUCT) }}
                    icon={<Product color={'#fff'}/>}
                />
                <FlatButton
                    label={t('Добавить сырье')}
                    labelStyle={flatButtonStyle.labelStyle}
                    backgroundColor={flatButtonStyle.rawColor}
                    hoverColor={flatButtonStyle.rawColor}
                    rippleColor={'#fff'}
                    onTouchTap={() => { productMaterialDialog.handleOpen(TYPE_RAW) }}
                    icon={<Raw color={'#fff'}/>}
                />
            </div>
            <Paper transitionEnabled={false} zDepth={1} className={classes.shipmentContent}>
                <header>
                    <ManufactureActivityDateRange filter={filter} initialValues={filterDialog.initialValues}/>
                    {tab === TAB.TAB_SHIFT &&
                    <a className={classes.filterBtn} onClick={filterDialog.handleOpenFilterDialog}>
                        <Filter/>
                        <span>{t('Фильтр')}</span>
                    </a>}
                </header>
                <ManufactureActivityFilterDialog
                    filterDialog={filterDialog}
                    fields={fields}
                    initialValues={filterDialog.initialValues}/>
                <div className={classes.details}>
                    <div className={classes.rightSide}>
                        <Tabs
                            value={tab}
                            contentContainerClassName={classes.tabWrapper}
                            inkBarStyle={tabStyles.ink}
                            onChange={(value) => tabData.handleTabChange(value)}>
                            <Tab
                                label={t('Обзор')}
                                className={classes.tab}
                                disableTouchRipple={true}
                                icon={<Sort/>}
                                value={TAB.TAB_SORTED}>
                                {!wholeEmpty
                                    ? <div className={classes.flexReview}>
                                        <div className={classes.productsBlock}>
                                            <Row className={classes.flexTitle}>
                                                <Col xs={6}><h4>{t('Произведено')}</h4></Col>
                                                <Col xs={2}><h4>{t('Всего')}</h4></Col>
                                                <Col xs={2}><h4>{t('Ок')}</h4></Col>
                                                <Col xs={2}><h4>{t('Брак')}</h4></Col>
                                            </Row>
                                            {!_.isEmpty(products)
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
                                            {!_.isEmpty(materials)
                                                ? materials
                                                : <div className={classes.emptyQuery}>
                                                    <div>{t('Не затрачено сырья')}</div>
                                                </div>}
                                        </div>
                                    </div>
                                    : reviewLoading
                                        ? <div className={classes.loader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <div className={classes.emptyQuery}>
                                            <div>{t('В данную смену не произведено ни одной продукции')}</div>
                                        </div>}
                            </Tab>

                            <Tab
                                label={t('Записи')}
                                className={classes.tab}
                                disableTouchRipple={true}
                                icon={<Log/>}
                                value={TAB.TAB_LOGS}>
                                {!_.isEmpty(logs)
                                    ? <div className={classes.productsBlock}>
                                        <div className={classes.pagination}>
                                            <Pagination filter={filterLogs}/>
                                        </div>
                                        <Row className={classes.flexTitle}>
                                            <Col xs={6}><h4>{t('Продукт / сырье')}</h4></Col>
                                            <Col xs={2}><h4>{t('Тип')}</h4></Col>
                                            <Col xs={2}><h4>{t('Кол-во')}</h4></Col>
                                            <Col xs={2}><h4>{t('Дата, время')}</h4></Col>
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
                            </Tab>

                            <Tab
                                label={t('Смены')}
                                className={classes.tab}
                                disableTouchRipple={true}
                                icon={<Shift/>}
                                value={TAB.TAB_SHIFT}>
                                {!_.isEmpty(shifts)
                                    ? <div className={classes.productsBlock}>
                                        <div className={classes.pagination}>
                                            <Pagination filter={filter}/>
                                        </div>
                                        <Row className={classes.flexTitleShift}>
                                            <Col xs={6}><h4>{t('Работник')}</h4></Col>
                                            <Col xs={3}><h4>{t('Начало смены')}</h4></Col>
                                            <Col xs={3}><h4>{t('Конец смены')}</h4></Col>
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
                            </Tab>
                        </Tabs>
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
        </div>
    )
})

export default ManufactureShipment
