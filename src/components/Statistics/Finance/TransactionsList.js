import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {compose} from 'recompose'
import _ from 'lodash'
import injectSheet from 'react-jss'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import {reduxForm, Field} from 'redux-form'
import Loader from '../../Loader'
import {TextField} from '../../ReduxForm'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {formattedType, ORDER, INCOME_FROM_AGENT} from '../../../constants/transactionTypes'
import NotFound from '../../Images/not-found.png'
import * as ROUTES from '../../../constants/routes'

const enhance = compose(
    injectSheet({
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
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
)

const ZERO = 0
const TransactionsList = enhance((props) => {
    const {
        classes,
        filter,
        handleSubmit,
        handleSubmitFilterDialog,
        listData,
        handleOpenCategoryPopup
    } = props

    const loading = _.get(listData, 'listLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№</Col>
            <Col xs={2}>Касса</Col>
            <Col xs={2}>Дата</Col>
            <Col xs={4}>Описание</Col>
            <Col xs={3}>Сумма</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const date = dateFormat(_.get(item, 'createdDate'))
        const amount = _.get(item, 'amount')
        const currency = _.get(item, ['currency', 'name'])
        const internal = _.toNumber(_.get(item, 'internal'))
        const customRate = _.get(item, 'customRate') ? _.toInteger(_.get(item, 'customRate')) : _.toInteger(amount / internal)
        const comment = _.get(item, 'comment')
        const cashbox = _.get(item, ['cashbox', 'name'])
        const expanseCategory = _.get(item, ['expanseCategory', 'name'])
        const order = _.get(item, 'order')
        const transType = _.toInteger(_.get(item, 'type'))
        const user = _.get(item, 'user')
        const clientName = _.get(item, ['client', 'name'])
        const clientId = _.get(item, ['client', 'id'])
        const type = formattedType[transType]
        return (
            <Row key={id} className="dottedList">
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{cashbox}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={4}>
                    {transType === ORDER
                    ? <Link target="_blank" to={{
                        pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
                        query: {search: order}
                    }}><span className={classes.clickable}> Оплата заказа № {order}</span>
                    </Link>
                    : transType === INCOME_FROM_AGENT
                    ? <Link target="_blank" to={{
                        pathname: ROUTES.TRANSACTION_LIST_URL,
                        query: {openTransactionInfo: id}
                    }}>{'Приемка наличных с  ' + user.firstName + ' ' + user.secondName}</Link>
                    : <strong>{type}&nbsp;
                        {clientName &&
                        <Link
                            target="_blank"
                            className={classes.clickable}
                            to={{
                                pathname: ROUTES.CLIENT_BALANCE_LIST_URL,
                                query: {search: clientId}
                            }}>
                        {clientName}
                        </Link>}
                    </strong>
                    }
                    {expanseCategory && <div><strong>Категория&nbsp;
                        <Link
                            className={classes.clickable}
                            onClick={() => handleOpenCategoryPopup(id) }>
                            {expanseCategory}
                        </Link>
                    </strong></div>}
                    {comment && <div><strong>Комментарий:</strong> {comment}</div>}
                </Col>
                <Col xs={3} style={{textAlign: 'right'}}>
                    <div className={amount > ZERO ? 'greenFont' : (amount === ZERO ? '' : 'redFont')}>
                        <span>{numberFormat(amount, currency)}</span>
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
                <div><b>Транзакции</b></div>
                <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                    <Field
                        className={classes.inputFieldCustom}
                        name="search"
                        component={TextField}
                        hintText="Поиск"/>
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
                        <div>По вашему запросу ничего не найдено</div>
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
