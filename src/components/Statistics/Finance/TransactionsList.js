import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {compose} from 'recompose'
import _ from 'lodash'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import Loader from '../../Loader'
import {TextField} from '../../ReduxForm'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import NotFound from '../../Images/not-found.png'
import {TransactionsFormat} from '../../Transaction'
import t from '../../../helpers/translate'
import ToolTip from '../../ToolTip'
import CashPayment from 'material-ui/svg-icons/maps/local-atm'
import BankPayment from 'material-ui/svg-icons/action/credit-card'

const enhance = compose(
    injectSheet({
        green: {
            color: '#81c784',
            fontWeight: '600'
        },
        red: {
            color: '#e57373',
            fontWeight: '600'
        },
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex'
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
        },
        tableWrapper: {
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0',
                        textAlign: 'right'
                    }
                }
            },
            '& .dottedList': {
                margin: '0 -30px !important',
                padding: '5px 30px',
                minHeight: '50px',
                '&:hover': {
                    background: '#f2f5f8'
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '& a': {
                    fontWeight: '600'
                }
            }
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
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        payment: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            textAlign: 'right',
            '& > div:last-child': {
                marginLeft: '5px'
            }
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
)

const ZERO = 0
const TWO = 2
const THREE = 3
const FOUR = 4
const TransactionsList = enhance((props) => {
    const {
        classes,
        filter,
        handleSubmit,
        handleSubmitFilterDialog,
        listData,
        isCashbox
    } = props

    const loading = _.get(listData, 'listLoading')
    const cashboxName = _.get(_.first(_.get(listData, 'data')), ['cashbox', 'name'])
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№</Col>
            <Col xs={isCashbox ? ZERO : TWO}>{isCashbox ? '' : t('Касса')}</Col>
            <Col xs={isCashbox ? THREE : TWO}>{t('Дата')}</Col>
            <Col xs={4}>{t('Описание')}</Col>
            <Col xs={isCashbox ? FOUR : THREE}>{t('Сумма')}</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const date = dateFormat(_.get(item, 'createdDate'), true)
        const amount = _.get(item, 'amount')
        const currency = _.get(item, ['currency', 'name'])
        const internal = _.toNumber(_.get(item, 'internalAmount'))
        const customRate = _.get(item, 'customRate') ? _.toInteger(_.get(item, 'customRate')) : _.toInteger(amount / internal)
        const comment = _.get(item, 'comment')
        const cashbox = _.get(item, ['cashbox', 'name'])
        const expenseCategory = _.get(item, ['expanseCategory'])
        const order = _.get(item, 'order')
        const transType = _.toInteger(_.get(item, 'type'))
        const user = _.get(item, 'user')
        const client = _.get(item, ['client'])
        const provider = _.get(item, ['provider'])
        const clientName = _.get(client, 'name')
        const providerName = _.get(provider, 'name')
        const supply = _.get(item, ['supply'])
        const incomeCategory = _.get(item, ['incomeCategory'])
        const supplyExpanseId = _.get(item, 'supplyExpanseId')
        const paymentType = _.get(item, 'paymentType')

        return (
            <Row key={id} className="dottedList">
                <Col xs={1}>{id}</Col>
                <Col xs={isCashbox ? ZERO : TWO}>{isCashbox ? null : cashbox}</Col>
                <Col xs={isCashbox ? THREE : TWO}>{date}</Col>
                <Col xs={4}>
                    <TransactionsFormat
                        type={transType}
                        order={order}
                        id={id}
                        client={client}
                        provider={provider}
                        user={user}
                        comment={comment}
                        supply={supply}
                        supplyExpanseId={supplyExpanseId}
                        expenseCategory={expenseCategory}
                        incomeCategory={incomeCategory}
                    />
                    {clientName && <div><strong>{t('Клиент')}:</strong> {clientName}</div>}
                    {providerName && <div><strong>{t('Поставщик')}:</strong> {providerName}</div>}
                </Col>
                <Col xs={isCashbox ? FOUR : THREE} style={{textAlign: 'right'}}>
                    <div className={amount > ZERO ? classes.green : (amount < ZERO ? classes.red : '')}>
                        <div className={classes.payment}>
                            {numberFormat(amount, currency)}
                            <ToolTip position="bottom" text={paymentType === 'bank' ? 'банковский счет' : 'наличные'}>
                                {paymentType === 'bank'
                                    ? <BankPayment style={{height: '18px', width: '18px', color: '#6261b0'}}/>
                                    : <CashPayment style={{height: '18px', width: '18px', color: '#12aaeb'}}/>}
                            </ToolTip>
                        </div>
                        {primaryCurrency !== currency && <div>{numberFormat(internal, primaryCurrency)} <span
                            style={{fontSize: 11, color: '#666', fontWeight: 600}}>({customRate})</span></div>}
                    </div>
                </Col>
            </Row>
        )
    })

    return (
        <div>
            <div className={classes.pagination}>
                <div><b>{t('Транзакции')} {!loading && isCashbox && <span>({cashboxName})</span>}</b></div>
                <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                    <Field
                        className={classes.inputFieldCustom}
                        name="search"
                        component={TextField}
                        hintText={t('Поиск')}/>
                </form>
                <Pagination filter={filter}/>
            </div>
            {loading
            ? <div className={classes.tableWrapper}>
                <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
            </div>
            : <div className={classes.tableWrapper}>
                {_.isEmpty(list) && !loading
                    ? <div className={classes.emptyQuery}>
                        <div>{t('По вашему запросу ничего не найдено')}</div>
                    </div>
                    : <div>
                        {headers}
                        {list}
                    </div>}
            </div>}
        </div>
    )
})

TransactionsList.propTypes = {
    filter: PropTypes.object.isRequired,
    handleSubmitFilterDialog: PropTypes.func.isRequired,
    listData: PropTypes.object.isRequired
}

export default TransactionsList
