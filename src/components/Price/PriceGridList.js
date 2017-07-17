import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import PriceFilterForm from './PriceFilterForm'
import PriceSupplyDialog from './PriceSupplyDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import PriceDetails from './PriceDetails'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        title: 'Названия',
        xs: 5
    },
    {
        sorting: true,
        name: 'type',
        title: 'Себестоимость',
        xs: 2
    },
    {
        sorting: true,
        name: 'price',
        title: 'Цена',
        xs: 3
    },
    {
        sorting: true,
        name: 'created_date',
        title: 'Дата обновления',
        xs: 2
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
        listRow: {
            position: 'relative',
            '& > a': {
                width: '100%',
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
                    fontWeight: '500'
                }
            }
        }
    })
)
const PriceGridList = enhance((props) => {
    const {
        classes,
        filter,
        filterDialog,
        priceSupplyDialog,
        priceSetForm,
        listData,
        detailData
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
            priceSetForm = {priceSetForm}
            handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
            mergedList={(detailData.mergedList())}>
        </PriceDetails>
    )
    const priceList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const netCost = _.get(item, 'netCost') ? numberFormat(_.get(item, 'netCost'), getConfig('PRIMARY_CURRENCY')) : 'Не установлено'
        const minPrice = _.get(item, 'minPrice')
        const maxPrice = _.get(item, 'maxPrice')
        const price = (minPrice && maxPrice) ? numberFormat(minPrice) + ' - ' + numberFormat(maxPrice, getConfig('PRIMARY_CURRENCY')) : 'Не установлено'
        const priceUpdate = _.get(item, 'priceUpdated') ? moment(_.get(item, 'priceUpdated')).format('DD.MM.YYYY') : 'Не установлено'
        return (
            <Row key={id} className={classes.listRow}>
                <Link to={{
                    pathname: sprintf(ROUTES.PRICE_ITEM_PATH, id),
                    query: filter.getParams()
                }}>
                    <Col xs={5}>{name}</Col>
                    <Col xs={2}>{netCost}</Col>
                    <Col xs={3}>{price}</Col>
                    <Col xs={2}>{priceUpdate}</Col>
                </Link>
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
