import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import StatStockCreateDialog from './StatStockCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import MainStyles from '../Styles/MainStyles'
import InComing from 'material-ui/svg-icons/navigation/arrow-upward'
import OutComing from 'material-ui/svg-icons/navigation/arrow-downward'

import StatStockFilterForm from './StatStockFilterForm'

const remainderHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 5,
        title: 'Наименование'
    },
    {
        sorting: true,
        name: 'type',
        xs: 3,
        title: 'Тип товара'
    },
    {
        sorting: true,
        xs: 2,
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
        title: 'Обьем'
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
                borderBottom: '3px solid #f2f5f8',
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
        }
    })),
    withState('showTransaction', 'setShowTransaction', false)
)

const StatStockGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        updateDialog,
        confirmDialog,
        filterDialog,
        listData,
        setShowTransaction,
        showTransaction,
        detailData,
        classes
    } = props

    const actions = (
        <div>

        </div>
    )

    const statStockFilterDialog = (
        <StatStockFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const statStockDetail = (
        <span>a</span>
    )
    const remainderStockList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={id}>
                <Col xs={5}>{name}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={2}>{id}</Col>
                <Col xs={2}>{id}</Col>
            </Row>
        )
    })

    const transactionStockList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const createdDate = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
        return (
            <Row key={id}>
                <Col xs={2}><strong>02016588</strong></Col>
                <Col xs={5}>Наименование продукта</Col>
                <Col xs={3}>{createdDate}
                    <span className={(id % '2') ? 'redFont' : 'greenFont'} style={{top: '2px', position: 'relative', left: '3px'}}>
                        {(id % '2') ? <OutComing style={{width: '14px', height: '14px'}}/> : <InComing style={{width: '14px', height: '14px'}}/>}
                    </span>
                </Col>
                <Col xs={2}>{id} шт</Col>
            </Row>
        )
    })

    const list = (!showTransaction) ? {
        header: remainderHeader,
        list: remainderStockList,
        loading: _.get(listData, 'listLoading')
    } : {
        header: transactionHeader,
        list: transactionStockList,
        loading: _.get(listData, 'listLoading')
    }
    return (
        <Container>
            <SubMenu url={ROUTES.STATSTOCK_LIST_URL}/>
            <Row>
                <Col xs={12}>
                    <div className={classes.stocksList}>
                        <ul>
                            <li className="active"><a>Все склады</a></li>
                            <li><a>Склад на ойбеке</a></li>
                            <li><a>Склад в Фергане</a></li>
                            <li><a>Склад на чорсу</a></li>
                        </ul>
                    </div>
                </Col>
            </Row>
            <Row style={{margin: '0 0 20px', padding: '8px 30px', background: '#fff', boxShadow: 'rgba(0, 0, 0, 0.1) 0 3px 10px'}}>
                <Col xs={3}>
                    <div className={classes.typeListStock}>
                        <a onClick={() => { setShowTransaction(false) }} className={!showTransaction && 'active'}>Остаток<br/>товара</a>
                    </div>
                    <div className={classes.typeListStock}>
                        <a onClick={() => { setShowTransaction(true) }} className={showTransaction && 'active'}>Движение<br/>товаров</a>
                    </div>
                </Col>
                <Col xs={9} style={{textAlign: 'right'}}>
                    <div className={classes.infoBlock}>
                        Товара на складе<br />
                        <span>555</span>
                    </div>
                    <div className={classes.infoBlock}>
                        Видов продукции:<br />
                        <span>100</span>
                    </div>
                    <div className={classes.infoBlock}>
                        Товаров на сумму:<br />
                        <span>1 000 000 UZS</span>
                    </div>
                </Col>
            </Row>

            <GridList
                filter={filter}
                filterDialog={statStockFilterDialog}
                list={list}
                detail={statStockDetail}
                actionsDialog={actions}
            />
            <StatStockCreateDialog
                isUpdate={true}
                initialValues={updateDialog.initialValues}
                open={updateDialog.openUpdateDialog}
                loading={updateDialog.updateLoading}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
            />

            <StatStockCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
                onSubmit={createDialog.handleSubmitCreateDialog}
            />

            {detailData.data && <ConfirmDialog
                type="delete"
                message="adfdasf"
                onClose={confirmDialog.handleCloseConfirmDialog}
                onSubmit={confirmDialog.handleSendConfirmDialog}
                open={confirmDialog.openConfirmDialog}
            />}
        </Container>
    )
})

StatStockGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired,
        handleSubmitCreateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatStockGridList
