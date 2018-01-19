import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import GridList from '../GridList'
import Container from '../Container'
import PendingExpensesFilterForm from './PendingExpensesFilterForm'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import moment from 'moment'
import t from '../../helpers/translate'
import TransactionCreateDialog from '../Transaction/TransactionCreateDialog'
import ToolTip from '../ToolTip'
import CashPayment from 'material-ui/svg-icons/maps/local-atm'
import BankPayment from 'material-ui/svg-icons/action/credit-card'

const listHeader = [
    {
        sorting: true,
        name: 'supply',
        title: '№ ' + t('поставки'),
        xs: 1
    },
    {
        sorting: false,
        name: 'provider',
        title: t('Поставщик'),
        xs: 2
    },
    {
        sorting: false,
        name: 'comment',
        title: t('Описание'),
        xs: 2
    },
    {
        sorting: false,
        name: 'type',
        title: t('Тип'),
        xs: 1
    },
    {
        sorting: false,
        name: 'division',
        title: t('Организация'),
        xs: 2
    },
    {
        sorting: false,
        name: 'createdDate',
        title: t('Дата'),
        xs: 1
    },
    {
        sorting: true,
        name: 'amount',
        alignRight: true,
        title: t('Сумма'),
        xs: 2
    },
    {
        sorting: true,
        name: 'balance',
        alignRight: true,
        title: t('Остаток'),
        xs: 1
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

const PendingExpensesGridList = enhance((props) => {
    const {
        classes,
        filter,
        updateDialog,
        filterDialog,
        listData,
        detailId
    } = props

    const selectedDetails = _.find(_.get(listData, 'data'), {'id': detailId})
    const pendingExpensesFilterDialog = (
        <PendingExpensesFilterForm
            initialValues={filterDialog.initialValues}
            filter={filter}
            filterDialog={filterDialog}
        />
    )

    const pendingExpensesDetail = (
        <span>a</span>
    )

    const pendingExpensesList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const supplyNo = _.get(item, 'supplyId')
        const provider = _.get(item, ['provider', 'name'])
        const division = _.get(item, ['division', 'name'])
        const paymentTypeIcon = _.get(item, 'paymentType') === 'cash'
            ? <ToolTip position={'left'} text={t('наличный')}>
                <CashPayment style={paymentIconStyle} color={'#12aaeb'}/>
            </ToolTip>
            : <ToolTip position={'left'} text={t('банковский счет')}>
                <BankPayment style={paymentIconStyle} color={'#6261b0'}/>
            </ToolTip>
        const type = _.get(item, 'type') === 'supply' ? t('Поставка') : t('Доп. расход')
        const comment = _.get(item, 'comment')
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'), true)
        const currency = _.get(item, ['currency', 'name'])
        const summary = _.get(item, 'totalAmount')
        const balance = _.get(item, 'remains')
        return (
            <Row className={classes.listRow} key={id} onClick={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                <Col xs={1}>{supplyNo}</Col>
                <Col xs={2}>{provider}</Col>
                <Col xs={2}>{comment}</Col>
                <Col xs={1}>{type}</Col>
                <Col xs={2}>{division}</Col>
                <Col xs={1}>{createdDate}</Col>
                <Col xs={2} style={{textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    {numberFormat(summary, currency)} {paymentTypeIcon}
                </Col>
                <Col xs={1} style={{textAlign: 'right'}}>{numberFormat(balance)} {currency}</Col>
            </Row>
        )
    })

    const list = {
        header: listHeader,
        list: pendingExpensesList,
        loading: _.get(listData, 'listLoading')
    }
    const detailType = _.get(selectedDetails, 'type')
    const detailSupply = _.get(selectedDetails, 'supplyId')
    const detailSupplyExpense = _.get(selectedDetails, 'id')
    const detailComment = _.get(selectedDetails, 'comment')
    const detailCurrency = _.get(selectedDetails, ['currency', 'name'])
    const detailAmount = numberFormat(_.get(selectedDetails, 'totalAmount'), detailCurrency)
    const detailRemains = numberFormat(_.get(selectedDetails, 'remains'), detailCurrency)
    const detailProvider = _.get(selectedDetails, ['provider', 'name'])
    const detailCreatedDate = _.get(selectedDetails, 'createdDate')
    const initialValues = {
        date: detailCreatedDate && moment(detailCreatedDate).toDate(),
        supply: {
            value: detailType === 'supply' ? detailSupply : null
        },
        supplyExpense: {
            value: detailType === 'supply_expense' ? detailSupplyExpense : null
        }
    }

    const additionalData = (
        <div className={classes.additionalData}>
            <div>
                <div>{t('Поставщик')}: <strong>{detailProvider}</strong></div>
                <div>{t('Поставка')} <strong>№{detailSupply}</strong></div>
                {detailType === 'supply_expense' && <div>{t('Доп. расход')} <strong>№{detailSupplyExpense}</strong></div>}
                <div>{t('Тип')}: <strong>{detailType === 'supply' ? t('Поставка') : t('Доп. расход')}</strong></div>
            </div>
            <div>
                <div>{t('Сумма расхода')}: <strong>{detailAmount}</strong></div>
                <div>{t('Остаток')}: <strong>{detailRemains}</strong></div>
                {detailComment && <div>{t('Комментарий')}: <strong>{detailComment}</strong></div>}
            </div>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.PENDING_EXPENSES_LIST_URL}/>

            <GridList
                filter={filter}
                list={list}
                detail={pendingExpensesDetail}
                filterDialog={pendingExpensesFilterDialog}
            />

            <TransactionCreateDialog
                isUpdate={true}
                isExpense={true}
                noCashbox={true}
                hideRedundant={true}
                expenseCategoryKey={'supply-supply_expanse'}
                detailCurrency={detailCurrency}
                additionalData={additionalData}
                open={updateDialog.openUpdateDialog}
                onClose={updateDialog.handleCloseUpdateDialog}
                onSubmit={updateDialog.handleSubmitUpdateDialog}
                initialValues={initialValues}
            />
        </Container>
    )
})

PendingExpensesGridList.propTypes = {
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

export default PendingExpensesGridList
