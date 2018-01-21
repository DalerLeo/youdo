import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import PendingPaymentsFilterForm from './PendingPaymentsFilterForm'
import SubMenu from '../SubMenu'
import ToolTip from '../ToolTip'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import toBoolean from '../../helpers/toBoolean'
import getConfig from '../../helpers/getConfig'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import t from '../../helpers/translate'
import TransactionCreateDialog from '../Transaction/TransactionCreateDialog'
import CashPayment from 'material-ui/svg-icons/maps/local-atm'
import BankPayment from 'material-ui/svg-icons/action/credit-card'

const listHeader = [
    {
        sorting: true,
        name: 'id',
        title: '№ ' + t('зак') + '.',
        xs: 1
    },
    {
        sorting: false,
        name: 'clientName',
        title: t('Клиент'),
        xs: 2
    },
    {
        sorting: false,
        name: 'marketName',
        title: t('Магазин'),
        xs: 2
    },
    {
        sorting: true,
        name: 'created_date',
        title: t('Дата'),
        xs: 1
    },
    {
        sorting: false,
        name: 'division',
        title: t('Организация'),
        xs: 2
    },
    {
        sorting: true,
        name: 'total_price',
        alignRight: true,
        title: t('Сумма заказа'),
        xs: 2
    },
    {
        sorting: true,
        name: 'totalBalance',
        alignRight: true,
        title: t('Остаток'),
        xs: 2
    }
]
const listHeaderHasMarket = [
    {
        sorting: true,
        name: 'id',
        title: '№ ' + t('зак') + '.',
        xs: 1
    },
    {
        sorting: false,
        name: 'clientName',
        title: t('Клиент'),
        xs: 3
    },
    {
        sorting: true,
        name: 'created_date',
        title: t('Дата'),
        xs: 2
    },
    {
        sorting: false,
        name: 'division',
        title: t('Организация'),
        xs: 2
    },
    {
        sorting: true,
        name: 'total_price',
        alignRight: true,
        title: t('Сумма заказа'),
        xs: 2
    },
    {
        sorting: true,
        name: 'totalBalance',
        alignRight: true,
        title: t('Остаток'),
        xs: 2
    }
]
const enhance = compose(
    injectSheet({
        listRow: {
            cursor: 'pointer',
            margin: '0 -30px !important',
            padding: '0 30px',
            width: 'auto !important'
        },
        additionalData: {
            display: 'flex',
            borderBottom: '1px #efefef solid',
            background: '#f2f5f8',
            '& > div': {
                lineHeight: '20px',
                padding: '15px 30px',
                width: '50%',
                '&:first-child': {
                    paddingRight: '10px'
                },
                '&:last-child': {
                    textAlign: 'right',
                    paddingLeft: '10px'
                }
            }
        }
    })
)

const paymentIconStyle = {
    width: 18,
    height: 18,
    marginLeft: 5
}

const PendingPaymentsGridList = enhance((props) => {
    const {
        classes,
        filter,
        updateDialog,
        filterDialog,
        listData,
        detailData
    } = props
    const hasMarket = toBoolean(getConfig('MARKETS_MODULE'))
    const pendingPaymentsFilterDialog = (
        <PendingPaymentsFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
            hasMarket={hasMarket}
        />
    )
    const pendingPaymentsDetail = (
        <span>a</span>
    )
    const pendingPaymentsList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, 'client')
        const market = _.get(item, ['market', 'name'])
        const division = _.get(item, ['division', 'name'])
        const currency = _.get(item, ['currency', 'name'])
        const paymentTypeIcon = _.get(item, 'paymentType') === 'cash'
            ? <ToolTip position={'left'} text={t('наличный')}>
                <CashPayment style={paymentIconStyle} color={'#12aaeb'}/>
            </ToolTip>
            : <ToolTip position={'left'} text={t('банковский счет')}>
                <BankPayment style={paymentIconStyle} color={'#6261b0'}/>
            </ToolTip>
        const clientName = _.get(client, 'name')
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currency)
        const totalBalance = numberFormat(_.get(item, 'totalBalance'), currency)
        return (
            <Row className={classes.listRow} key={id} onClick={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{clientName}</Col>
                {hasMarket && <Col xs={2}>{market}</Col>}
                <Col xs={1}>{createdDate}</Col>
                <Col xs={2}>{division}</Col>
                <Col xs={2} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>{totalPrice} {paymentTypeIcon}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{totalBalance}</Col>
            </Row>
        )
    })

    const list = {
        header: hasMarket ? listHeader : listHeaderHasMarket,
        list: pendingPaymentsList,
        loading: _.get(listData, 'listLoading')
    }
    const detailCreatedDate = _.get(detailData, ['data', 'createdDate'])
    const detailOrder = _.get(detailData, ['data', 'id'])
    const detailClient = _.get(detailData, ['data', 'client', 'name'])
    const detailCurrency = _.get(detailData, ['data', 'currency', 'name'])
    const detailDivision = _.get(detailData, ['data', 'division', 'name'])
    const detailDivisionID = _.get(detailData, ['data', 'division', 'id'])
    const detailMarket = _.get(detailData, ['data', 'market', 'name'])
    const detailPaymentType = _.get(detailData, ['data', 'paymentType'])
    const detailTotalPrice = numberFormat(_.get(detailData, ['data', 'totalPrice']), detailCurrency)
    const detailTotalBalance = numberFormat(_.get(detailData, ['data', 'totalBalance']), detailCurrency)

    const additionalData = (
        <div className={classes.additionalData}>
            <div>
                <div>{t('Заказ')} <strong>№{detailOrder}</strong></div>
                <div>{t('Клиент')}: <strong>{detailClient}</strong></div>
                <div>{t('Магазин')}: <strong>{detailMarket}</strong></div>
                <div>{t('Организация')}: <strong>{detailDivision}</strong></div>
            </div>
            <div>
                <div>{t('Тип оплаты')}: <strong>{detailPaymentType === 'cash' ? t('Наличными') : t('Перечислением')}</strong></div>
                <div>{t('Сумма заказа')}: <strong>{detailTotalPrice}</strong></div>
                <div>{t('Остаток')}: <strong>{detailTotalBalance}</strong></div>
            </div>
        </div>
    )

    const initialValues = {
        date: detailCreatedDate && moment(detailCreatedDate).toDate(),
        order: {
            value: detailOrder
        },
        division: {
            value: detailDivisionID
        }
    }

    return (
        <Container>
            <SubMenu url={ROUTES.PENDING_PAYMENTS_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={pendingPaymentsDetail}
                filterDialog={pendingPaymentsFilterDialog}
            />

            <TransactionCreateDialog
                isUpdate={true}
                noCashbox={true}
                hideRedundant={true}
                detailCurrency={detailCurrency}
                incomeCategoryKey={'order'}
                additionalData={additionalData}
                open={updateDialog.openUpdateDialog}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                initialValues={initialValues}
            />
        </Container>
    )
})

PendingPaymentsGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    filterDialog: PropTypes.shape({
        initialValues: PropTypes.object,
        filterLoading: PropTypes.bool,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default PendingPaymentsGridList
