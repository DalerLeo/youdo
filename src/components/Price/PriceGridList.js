import _ from 'lodash'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Price from 'material-ui/svg-icons/editor/attach-money'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Person from 'material-ui/svg-icons/social/person'
import FlatButton from 'material-ui/FlatButton'
import PriceFilterForm from './PriceFilterForm'
import PriceDetails from './PriceDetails'
import PriceSupplyDialog from './PriceSupplyDialog'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import ToolTip from '../ToolTip'
import Container from '../Container'
import SubMenu from '../SubMenu'
import SetPrice from './SetPrice'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'
import dataFormat from '../../helpers/dateFormat'
import t from '../../helpers/translate'

const listHeader = [
    {
        sorting: false,
        name: 'name',
        title: t('Название'),
        xs: 3
    },
    {
        sorting: true,
        name: 'code',
        title: t('Код товара'),
        xs: 2
    },
    {
        sorting: true,
        name: 'netCost',
        title: t('Себестоимость'),
        alignRight: true,
        xs: 2
    },
    {
        sorting: false,
        name: 'minPrice',
        title: t('Цена'),
        alignRight: true,
        xs: 2
    },
    {
        sorting: true,
        name: 'priceUpdated',
        title: t('Дата обновления'),
        xs: 2
    }
]
const enhance = compose(
    injectSheet({
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            marginTop: '0px!important',
            height: '20px!important',
            width: '50px!important',
            '& hr': {
                bottom: '0!important'
            },
            '& input': {
                top: '-2px',
                textAlign: 'right'
            }
        },
        priceImg: {
            width: '30px',
            height: '30px',
            overflow: 'hidden',
            marginRight: '5px',
            display: 'inline-block',
            borderRadius: '4px',
            textAlign: 'center',
            '& img': {
                height: '30px'
            }
        },
        excelButton: {
            position: 'absolute',
            top: '0',
            right: '0',
            display: 'flex',
            alignItems: 'center',
            height: '60px',
            '& > div:first-child': {
                padding: '0 10px',
                '& > div': {
                    textAlign: 'right'
                }
            },
            '& span': {
                fontSize: '12px !important',
                fontWeight: '600'
            }
        },
        listRow: {
            position: 'relative',
            '& > a': {
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: '0',
                left: '-30px',
                right: '-30px',
                bottom: '0',
                padding: '0 30px',
                '& > div:first-child': {
                    fontWeight: '600'
                },
                '& > div': {
                    fontWeight: '400'
                }
            }
        },
        icon: {
            zIndex: '2',
            textAlign: 'right',
            '& > div > div:first-child': {
                width: '22px',
                marginLeft: 'auto'
            }
        },
        excel: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        }
    })
)
const flatButtonStyle = {
    backgroundColorPrice: '#12aaeb',
    backgroundColorExcel: '#71ce87',
    style: {
        height: '34px',
        lineHeight: '34px',
        overflow: 'unset'
    },
    iconStyle: {
        color: '#fff',
        fill: '#fff',
        width: '18px',
        height: '18px',
        marginBottom: '4px'
    },
    labelStyle: {
        color: '#fff',
        fontWeight: '600',
        verticalAlign: 'baseline',
        textTransform: 'none'
    },
    rippleColor: '#fff'
}

const PriceGridList = enhance((props) => {
    const {
        classes,
        filter,
        filterDialog,
        priceSupplyDialog,
        priceSetForm,
        listData,
        detailData,
        getDocument,
        setPriceDialog,
        defaultDialog
    } = props
    const expenseList = _.get(detailData, 'priceItemExpenseList')
    const expenseLoading = _.get(detailData, 'priceItemExpenseLoading')
    const priceFilterDialog = (
        <PriceFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )
    const listDetailData = _.filter(_.get(listData, 'data'), (o) => {
        return o.id === _.get(detailData, 'id')
    })

    const priceDetail = (
        <PriceDetails
            key={_.get(detailData, 'id')}
            detailData={detailData}
            listDetailData={listDetailData}
            priceSupplyDialog={priceSupplyDialog}
            priceSetForm={priceSetForm}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            defaultDialog={defaultDialog}
            mergedList={(detailData.mergedList())}>
        </PriceDetails>
    )

    const excelButton = (
        <div className={classes.excelButton}>
            <div>
                <FlatButton
                    label={t('Добавить цену')}
                    style={flatButtonStyle.style}
                    onClick={setPriceDialog.handleOpenSetPriceDialog}
                    backgroundColor={flatButtonStyle.backgroundColorPrice}
                    hoverColor={flatButtonStyle.backgroundColorPrice}
                    rippleColor={flatButtonStyle.rippleColor}
                    labelStyle={flatButtonStyle.labelStyle}
                    icon={<Price style={flatButtonStyle.iconStyle}/>}/>
            </div>
            <div>
                <FlatButton
                    label={t('Скачать')}
                    style={flatButtonStyle.style}
                    onClick={getDocument}
                    backgroundColor={flatButtonStyle.backgroundColorExcel}
                    hoverColor={flatButtonStyle.backgroundColorExcel}
                    rippleColor={flatButtonStyle.rippleColor}
                    labelStyle={flatButtonStyle.labelStyle}
                    icon={<Excel style={flatButtonStyle.iconStyle}/>}/>
            </div>
        </div>
    )

    const priceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const currency = getConfig('PRIMARY_CURRENCY')
        const codeProduct = _.get(item, 'code') || t('Не установлен')
        const netCost = _.get(item, 'netCost') ? numberFormat(_.get(item, 'netCost'), currency) : t('Не установлена')
        const minPrice = _.get(item, 'minPrice')
        const maxPrice = _.get(item, 'maxPrice')
        const price = (minPrice && maxPrice) ? numberFormat(minPrice) + ' - ' + numberFormat(maxPrice, getConfig('PRIMARY_CURRENCY')) : t('Не установлена')
        const priceUpdate = _.get(item, 'priceUpdated') ? dataFormat(_.get(item, 'priceUpdated')) : t('Не установлена')
        const customPrice = _.get(item, 'customPrice')

        const internalMinPrice = numberFormat(_.get(item, 'internalMinPrice'))
        const internalMaxPrice = numberFormat(_.get(item, 'internalMaxPrice'), currency)
        const tooltipText = t('Агент может устанавливать цены') + '<br/>' + internalMinPrice + ' - ' + internalMaxPrice
        const tooltipText2 = t('Агент не может устанавливать цены')

        return (
            <Row key={id} className={classes.listRow}>
                <Col xs={3} style={{wordBreak: 'break-all'}}>{name}</Col>
                <Link to={{
                    pathname: sprintf(ROUTES.PRICE_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                </Link>
                <Col xs={2}>{codeProduct}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{netCost}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{price}</Col>
                <Col xs={2}>{priceUpdate}</Col>
                <Col xs={1} className={classes.icon}>
                    {customPrice
                        ? <ToolTip position="bottom" text={tooltipText}>
                            <Person style={{width: 22, color: '#81c784'}}/>
                        </ToolTip>
                        : <ToolTip position="bottom" text={tooltipText2}>
                            <Person style={{width: 22, color: '#999'}}/>
                        </ToolTip>}
                </Col>
            </Row>
        )
    })
    const list = {
        header: listHeader,
        list: priceList,
        loading: _.get(listData, 'listLoading')
    }

    return (
        <Container>
            <SubMenu url={ROUTES.PRICE_LIST_URL}/>
            {excelButton}
            <GridList
                filter={filter}
                list={list}
                detail={priceDetail}
                filterDialog={priceFilterDialog}
            />
            <PriceSupplyDialog
                open={priceSupplyDialog.openPriceSupplyDialog}
                onClose={priceSupplyDialog.handleCloseSupplyDialog}
                list={expenseList}
                loading={expenseLoading}
            />
            <SetPrice
                data={setPriceDialog.data}
                priceList={setPriceDialog.priceList}
                loading={setPriceDialog.loading}
                moreLoading={setPriceDialog.moreLoading}
                loadMore={setPriceDialog.loadMore}
                open={setPriceDialog.openSetPriceDialog}
                onClose={setPriceDialog.handleCloseSetPriceDialog}
                onSubmit={setPriceDialog.handleSubmitSetPriceDialog}
                currencyChooseDialog={setPriceDialog.currencyChooseDialog}
                filterCurrency={setPriceDialog.filterCurrency}
                filter={filter}
            />
        </Container>
    )
})
PriceGridList.propTypes = {
    filter: PropTypes.object.isRequired,

    listData: PropTypes.object,
    detailData: PropTypes.object,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    priceSupplyDialog: PropTypes.shape({
        openPriceSupplyDialog: PropTypes.number.isRequired,
        handleOpenSupplyDialog: PropTypes.func.isRequired,
        handleCloseSupplyDialog: PropTypes.func.isRequired
    }).isRequired,
    priceSetForm: PropTypes.shape({
        openPriceSetForm: PropTypes.bool.isRequired,
        handleOpenPriceSetForm: PropTypes.func.isRequired,
        handleClosePriceSetForm: PropTypes.func.isRequired,
        handleSubmitPriceSetForm: PropTypes.func.isRequired
    }).isRequired
}
export default PriceGridList
