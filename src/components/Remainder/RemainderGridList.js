import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import RemainderDetails from './RemainderDetails'
import numberFormat from '../../helpers/numberFormat'
import RemainderTransferDialog from './RemainderTransferDialog'
import RemainderFilterForm from './RemainderFilterForm'
import RemainderDiscardDialog from './RemainderDiscardDialog'
import {reduxForm} from 'redux-form'
import NotFound from '../Images/not-found.png'
import RemainderReservedDialog from './RemainderReservedDialog'
import GridList from '../GridList'
import AddProductDialog from './AddProductsDialog'
import RemainderInventoryDialog from './InventoryDialog'
import FlatButton from 'material-ui/FlatButton'

const ZERO = 0
const enhance = compose(
    injectSheet({
        listWrapper: {
            '& > div:first-child': {
                marginTop: '0 !important'
            },
            '& > div:last-child': {
                marginBottom: '100px !important'
            }
        },
        wrapper: {
            position: 'relative',
            padding: '0 30px',
            marginBottom: '5px',
            transition: 'all 400ms ease-out !important',
            '& > a': {
                color: 'inherit'
            },
            '& .row': {
                alignItems: 'center',
                '& div': {
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center'
                }
            }
        },
        wrapperBold: {
            extend: 'wrapper',
            margin: '20px -15px !important',
            transition: 'all 400ms ease-out !important',
            '& .row:first-child': {
                fontWeight: '600'
            }
        },
        headers: {
            padding: '20px 30px 10px',
            '& .row': {
                alignItems: 'center'
            }
        },
        productList: {
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        search: {
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            width: '220px',
            left: 'calc(50% - 110px)',
            top: '0',
            bottom: '0'
        },
        products: {
            display: 'flex',
            '& > div': {
                marginRight: '60px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        itemData: {
            textAlign: 'left',
            fontWeight: '600'
        },
        itemOpenData: {
            extend: 'itemData',
            zIndex: '2',
            color: '#129fdd',
            cursor: 'pointer'
        },
        dropDown: {
            position: 'absolute !important',
            height: '48px !important',
            right: '0',
            top: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        dropUp: {
            extend: 'dropDown',
            transform: 'rotate(180deg)'
        },
        loader: {
            display: 'flex',
            height: '328px',
            alignItems: 'center',
            justifyContent: 'center'
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
        clearBtn: {
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            color: '#909090',
            '& button': {
                '& > div': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }

        },
        nav: {
            height: '48px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 30px'
        },
        sendButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        filterHolder: {
            width: '260px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative'
        },
        sendButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px',
            zIndex: '999'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '225px',
            padding: '260px 0 50px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        openDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        },
        sendBtn: {
            width: '40px',
            height: '40px',
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0',
            borderRadius: '100%'
        },
        discardBtn: {
            width: '40px',
            height: '40px',
            position: 'absolute',
            top: '10px',
            right: '50px',
            marginBottom: '0',
            borderRadius: '100%'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
            height: '60px',
            position: 'absolute',
            top: '0',
            right: '0',
            fontWeight: '600',
            '& button': {
                '& span': {
                    fontWeight: '600 !important',
                    textTransform: 'none !important',
                    verticalAlign: 'baseline !important'
                }
            }
        }
    }),
    reduxForm({
        form: 'RemainderSearchForm',
        enableReinitialize: true
    }),
)

const headerItems = [
    {
        name: 'product_name',
        sorting: true,
        title: 'Товар',
        xs: 2
    },
    {
        name: 'productType',
        sorting: false,
        title: 'Тип товара',
        xs: 2
    },
    {
        sorting: true,
        name: 'balance',
        title: 'Остатки',
        xs: 2
    },
    {
        sorting: true,
        name: 'defect',
        title: 'Бракованные товары',
        xs: 2
    },
    {
        sorting: true,
        name: 'reserved',
        title: 'Забронированые',
        xs: 2
    },
    {
        sorting: true,
        name: 'available',
        title: 'Доступные товары',
        xs: 2
    }
]

const RemainderGridList = enhance((props) => {
    const {
        detailData,
        classes,
        filter,
        listData,
        transferDialog,
        discardDialog,
        handleCloseDetail,
        filterItem,
        filterDialog,
        reservedDialog,
        addProductDialog,
        inventoryDialog
    } = props
    const listLoading = _.get(listData, 'listLoading')

    const remainderFilterDialog = (
        <RemainderFilterForm
            filterDialog={filterDialog}
            filter={filter}
            initialValues={filterDialog.initialValues}/>
    )

    const remainderDetail = (
        <RemainderDetails
            key={_.get(detailData, 'id')}
            detailData={detailData || {}}
            filterItem={filterItem}
            reservedOpen={reservedDialog.handleOpenRemainderReservedDialog}
            handleCloseDetail={handleCloseDetail}
        />

    )

    const remainderList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const product = _.get(item, 'title')
        const balance = _.toNumber(_.get(item, 'balance'))
        const defects = _.toNumber(_.get(item, 'defects'))
        const reserved = _.toNumber(_.get(item, 'reserved'))
        const accept = balance - reserved
        const measurement = _.get(item, ['measurement', 'name'])
        const type = _.get(item, ['type', 'name'])
        return (
            <Row key={id} style={{position: 'relative'}}>
                <Link
                    target="_blank"
                    to={{pathname: ROUTES.STOCK_OUT_HISTORY_LIST_URL, query: filter.getParams({'product': id})}}
                    className={classes.openDetail}>
                </Link>
                <Col xs={2}>{product}</Col>
                <Col xs={2}>{type}</Col>
                <Col xs={2} className={classes.itemData}>{numberFormat(balance, measurement)}</Col>
                <Col xs={2} className={classes.itemData}>{numberFormat(defects, measurement)}</Col>
                {(reserved > ZERO)
                    ? <Col xs={2} className={classes.itemOpenData}
                           onClick={() => { reservedDialog.handleOpenRemainderReservedDialog(id) }}>
                        {numberFormat(reserved, measurement)}
                    </Col>
                    : <Col xs={2} className={classes.itemData}>
                        {numberFormat(reserved, measurement)}
                    </Col>}
                <Col xs={2} className={classes.itemData}>{numberFormat(accept, measurement)}</Col>
            </Row>
        )
    })

    const list = {
        header: headerItems,
        list: remainderList,
        loading: listLoading
    }

    return (
        <Container>
            <SubMenu url={ROUTES.REMAINDER_LIST_URL}/>

            <div className={classes.buttons}>
                <FlatButton
                    label={'Инвентаризация'}
                    labelStyle={{color: '#12aaeb'}}
                    onClick={inventoryDialog.handleOpenInventoryDialog}/>
                <FlatButton
                    label={'Передача товаров'}
                    labelStyle={{color: '#12aaeb'}}
                    onClick={transferDialog.handleOpenTransferDialog}/>
                <FlatButton
                    label={'Списание товара'}
                    labelStyle={{color: '#e57373'}}
                    onClick={discardDialog.handleOpenDiscardDialog}/>
            </div>

            <GridList
                filter={filter}
                list={list}
                detail={remainderDetail}
                filterDialog={remainderFilterDialog}
            />
            <RemainderTransferDialog
                open={transferDialog.openTransferDialog}
                onClose={transferDialog.handleCloseTransferDialog}
                onSubmit={transferDialog.handleSubmitTransferDialog}
                handleOpenAddProduct={addProductDialog.handleOpenAddProduct}/>
            <RemainderDiscardDialog
                open={discardDialog.openDiscardDialog}
                onClose={discardDialog.handleCloseDiscardDialog}
                onSubmit={discardDialog.handleSubmitDiscardDialog}
                handleOpenAddProduct={addProductDialog.handleOpenAddProduct}/>

            <RemainderReservedDialog
                listLoading={listLoading}
                loading={reservedDialog.loading}
                reservedDetail={reservedDialog.reservedDetail}
                data={reservedDialog.data}
                open={reservedDialog.openReversedDialog > ZERO}
                onClose={reservedDialog.handleCloseRemainderReservedDialog}
                filterItem={reservedDialog.dialogFilter}/>

            {addProductDialog.openAddProductDialog &&
            <AddProductDialog
                open={addProductDialog.openAddProductDialog}
                loading={addProductDialog.loading}
                filter={addProductDialog.filter}
                data={addProductDialog.data}
                onClose={addProductDialog.handleCloseAddProduct}
                onSubmit={addProductDialog.handleSubmitAddProduct}
                initialValues={addProductDialog.initialValues}
                openAddProductConfirm={addProductDialog.openAddProductConfirm}
                handleCloseAddProductConfirm={addProductDialog.handleCloseAddProductConfirm}
                handleSubmitAddProductConfirm={addProductDialog.handleSubmitAddProductConfirm}
                withoutCustomPrice={true}
                withoutValidations={true}
            />}

            <RemainderInventoryDialog
                data={inventoryDialog.data}
                loading={inventoryDialog.loading}
                moreLoading={inventoryDialog.moreLoading}
                loadMore={inventoryDialog.loadMore}
                open={inventoryDialog.openInventoryDialog}
                onClose={inventoryDialog.handleCloseInventoryDialog}
                stockChooseDialog={inventoryDialog.stockChooseDialog}
                filterStock={inventoryDialog.filterStock}
                filter={filter}
            />
        </Container>
    )
})

RemainderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    filterItem: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filterDialog: PropTypes.shape({
        openFilterDialog: PropTypes.bool.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired,
        handleClearFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    transferDialog: PropTypes.shape({
        openTransferDialog: PropTypes.bool.isRequired,
        handleOpenTransferDialog: PropTypes.func.isRequired,
        handleCloseTransferDialog: PropTypes.func.isRequired,
        handleSubmitTransferDialog: PropTypes.func.isRequired
    }).isRequired,
    discardDialog: PropTypes.shape({
        openDiscardDialog: PropTypes.bool.isRequired,
        handleOpenDiscardDialog: PropTypes.func.isRequired,
        handleCloseDiscardDialog: PropTypes.func.isRequired,
        handleSubmitDiscardDialog: PropTypes.func.isRequired
    }).isRequired,
    reservedDialog: PropTypes.shape({
        reservedDetail: PropTypes.array,
        data: PropTypes.array,
        openReversedDialog: PropTypes.number.isRequired,
        handleOpenRemainderReservedDialog: PropTypes.func.isRequired,
        handleCloseRemainderReservedDialog: PropTypes.func.isRequired
    }).isRequired,
    inventoryDialog: PropTypes.shape({
        data: PropTypes.array,
        loading: PropTypes.bool,
        moreLoading: PropTypes.bool,
        openInventoryDialog: PropTypes.bool,
        stockChooseDialog: PropTypes.bool,
        filterStock: PropTypes.func.isRequired,
        loadMore: PropTypes.func.isRequired,
        handleOpenInventoryDialog: PropTypes.func.isRequired,
        handleCloseInventoryDialog: PropTypes.func.isRequired
    }).isRequired
}

export default RemainderGridList
