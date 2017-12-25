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
        listData
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
        const expenseCategory = _.get(item, ['expanseCategory'])
        const order = _.get(item, 'order')
        const transType = _.toInteger(_.get(item, 'type'))
        const user = _.get(item, 'user')
        const client = _.get(item, ['client'])
        const supply = _.get(item, ['supply'])
        return (
            <Row key={id} className="dottedList">
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{cashbox}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={4}>
                    <TransactionsFormat
                        type={transType}
                        order={order}
                        id={id}
                        expenseCategory={expenseCategory}
                        client={client}
                        user={user}
                        comment={comment}
                        supply={supply}
                    />

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
