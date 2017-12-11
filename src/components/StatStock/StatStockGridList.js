import _ from 'lodash'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import MainStyles from '../Styles/MainStyles'
import InComing from 'material-ui/svg-icons/navigation/arrow-upward'
import OutComing from 'material-ui/svg-icons/navigation/arrow-downward'
import Loader from '../Loader'
import Paper from 'material-ui/Paper'
import numberFormat from '../../helpers/numberFormat'
import StatStockFilterForm from './StatStockFilterForm'
import getConfig from '../../helpers/getConfig'

const remainderHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 2,
        title: '№'
    },
    {
        sorting: true,
        name: 'title',
        xs: 5,
        title: 'Наименование'
    },
    {
        sorting: true,
        xs: 3,
        name: 'balance',
        title: 'Остаток'
    },
    {
        sorting: true,
        xs: 2,
        name: 'money',
        title: 'На сумму'
    }
]
const transactionHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 2,
        title: 'Баркод'
    },
    {
        sorting: true,
        name: 'type',
        xs: 5,
        title: 'Наименование'
    },
    {
        sorting: true,
        xs: 3,
        name: 'balance',
        title: 'Транзакция'
    },
    {
        sorting: true,
        xs: 2,
        name: 'money',
        title: 'Объем'
    }
]

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        stocksList: {
            margin: '10px 0 0',
            '& li': {
                display: 'inline-block',
                fontSize: '0',
                padding: '10px 0px 15px',
                marginRight: '30px',
                borderBottom: '3px solid transparent',
                cursor: 'pointer',
                '& a': {
                    fontSize: '13px',
                    color: '#999',
                    fontWeight: '600'
                }
            },
            '& li.active': {
                color: '#333',
                borderBottom: '3px solid #129fdd',
                '& a': {
                    color: '#333',
                    cursor: 'text'
                }
            }
        },
        infoBlock: {
            width: '25%',
            display: 'inline-block',
            color: '#999',
            fontWeight: '400',
            fontSize: '13px',
            lineHeight: '1.3',
            borderLeft: '1px solid #efefef',
            padding: '12px 15px 12px 15px',
            alignItems: 'center',
            '& span': {
                color: '#333',
                fontWeight: '700',
                fontSize: '24px !important'
            },
            '&:first-child': {
                border: 'none'
            }
        },
        typeListStock: {
            width: '100px',
            height: 'calc(100% + 16px)',
            marginTop: '-8px',
            float: 'left',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRight: '1px solid #fff',
            backgroundColor: '#eceff5',
            '& a': {
                display: 'block',
                width: '100%',
                fontWeight: '600'
            },
            '& a.active': {
                color: '#333',
                cursor: 'text'
            },
            '&:last-child': {
                border: 'none'
            },
            '&:first-child': {

                marginLeft: '-38px'
            }
        },
        loader: {
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        statLoader: {
            background: '#fff',
            height: '66px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })),
    withState('showTransaction', 'setShowTransaction', false)
)

const StatStockGridList = enhance((props) => {
    const {
        filter,
        filterDialog,
        listData,
        detailData,
        classes,
        statStockData,
        getDocument
    } = props

    const handleClickTapChange = _.get(listData, 'handleClickTapChange')
    const statStockFilterDialog = (
        <StatStockFilterForm
            getDocument={getDocument}
            isBalance={_.get(listData, 'tab')}
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const statStockDetail = (
        <span>a</span>
    )
    const remainderStockList = _.map(_.get(listData, 'remainderList'), (item) => {
        const id = _.get(item, 'id')
        const title = _.get(item, 'title')
        const cost = numberFormat(_.get(item, ['totalPrice']), getConfig('PRIMARY_CURRENCY'))
        const balance = numberFormat(_.get(item, 'balance'), _.get(item, ['measurement', 'name']))
        return (
            <Row key={id}>
                <Col xs={2}>{id}</Col>
                <Col xs={5}>{title}</Col>
                <Col xs={3}>{balance}</Col>
                <Col xs={2}>{cost}</Col>
            </Row>
        )
    })

    const ZERO = 0

    const transactionStockList = _.map(_.get(listData, 'transactionList'), (item) => {
        const id = _.get(item, 'id')
        const barcode = _.get(item, 'barcode')
        const amount = _.get(item, 'amount')
        const name = _.get(item, ['product', 'name'])
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY - HH:mm:ss')
        const balance = numberFormat(_.get(item, 'amount'), _.get(item, ['product', 'measurement', 'name']))

        return (
            <Row key={id}>
                <Col xs={2}><strong>{barcode}</strong></Col>
                <Col xs={5}>{name}</Col>
                <Col xs={3}>{createdDate}
                    <span className={(amount < ZERO) ? 'redFont' : 'greenFont'}
                          style={{top: '2px', position: 'relative', left: '3px'}}>
                        {(amount < ZERO) ? <OutComing style={{width: '14px', height: '14px'}}/>
                            : <InComing style={{width: '14px', height: '14px'}}/>}
                    </span>
                </Col>
                <Col xs={2}>{balance}</Col>
            </Row>
        )
    })

    const balanceTab = 1
    const transactionTab = 2
    const tab = _.get(listData, 'tab')

    const list = (tab === transactionTab) ? {
        header: transactionHeader,
        list: transactionStockList,
        loading: _.get(listData, 'transactionLoading')
    } : {
        header: remainderHeader,
        list: remainderStockList,
        loading: _.get(listData, 'remainderLoading')
    }

    const handleClick = _.get(listData, 'handleClickStatStock')

    const stockList = _.map(_.get(listData, 'stockList'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        return (
                <li key={id}
                    className={_.get(detailData, 'id') === id ? 'active' : ''}>
                    <span onClick={() => { handleClick(id) }}>{name}</span>
                </li>
        )
    })
    const amountProduct = _.get(statStockData, ['statStockData', 'productCount'])
    const amountTypeProduct = _.get(statStockData, ['statStockData', 'productTypeCount'])
    const totalPriceProduct = numberFormat(_.get(statStockData, ['statStockData', 'totalPrice']), getConfig('PRIMARY_CURRENCY'))

    return (
        <Container>
            <SubMenu url={ROUTES.STATSTOCK_LIST_URL}/>
            <Row>
                <Col xs={12}>
                    <div className={classes.stocksList}>
                        <li className={ !_.get(detailData, 'id') ? 'active' : ''}>
                            <Link to={{
                                pathname: sprintf(ROUTES.STATSTOCK_ITEM_PATH, ZERO),
                                query: filter.getParams()
                            }}>Все склады</Link>
                        </li>
                        {stockList}
                    </div>
                </Col>
            </Row>
            <Paper zDepth={1} style={{
                margin: '0 0 20px',
                padding: '8px 30px',
                display: 'flex'
            }}>
                <Col xs={3}>
                    <div className={classes.typeListStock} style={tab === balanceTab ? {background: '#eceff5'} : {background: '#fff'}}>
                        <a onClick={() => { handleClickTapChange(balanceTab) }}
                           className={tab === balanceTab ? 'active' : ''}>Остаток<br/>товара</a>
                    </div>
                    <div className={classes.typeListStock} style={tab === transactionTab ? {background: '#eceff5'} : {background: '#fff'}}>
                        <a onClick={() => { handleClickTapChange(transactionTab) }}
                           className={tab === transactionTab ? 'active' : ''}>Движение<br/>товаров</a>
                    </div>
                </Col>
                <Col xs={9} style={{textAlign: 'right'}}>
                    {_.get(statStockData, 'statStockDataLoading')
                        ? <div className={classes.statLoader}>
                            <Loader size={0.75}/>
                        </div>
                        : <div>
                            <div className={classes.infoBlock}>
                                Товара на складе<br />
                                <span>{amountProduct}</span>
                            </div>
                            <div className={classes.infoBlock}>
                                Видов продукции:<br />
                                <span>{amountTypeProduct}</span>
                            </div>
                            <div className={classes.infoBlock}>
                                Товаров на сумму:<br />
                                <span>{totalPriceProduct}</span>
                            </div>
                        </div>
                    }
                </Col>
            </Paper>

            <GridList
                filter={filter}
                filterDialog={statStockFilterDialog}
                list={list}
                detail={statStockDetail}
            />
        </Container>
    )
})

StatStockGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statStockData: PropTypes.object.isRequired,
    handleClickStock: PropTypes.object.isRequired
}

export default StatStockGridList
