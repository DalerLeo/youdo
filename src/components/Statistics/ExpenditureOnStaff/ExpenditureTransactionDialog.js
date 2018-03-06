import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm} from 'redux-form'
import {Link} from 'react-router'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Loader from '../../Loader'
import NotFound from '../../Images/not-found.png'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import GridListNavPagination from '../../../components/GridList/GridListNavPagination'
import {TransactionsFormat, TRANSACTION_STAFF_EXPENSE_DIALOG} from '../../Transaction'
import t from '../../../helpers/translate'
import * as ROUTES from '../../../constants/routes'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '400px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        popUp: {
            color: '#333 !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            marginBottom: '64px'
        },
        content: {
            width: '100%',
            display: 'block',
            '& > div:last-child': {
                padding: '0 30px',
                borderTop: '1px #efefef solid'
            }
        },
        titleSummary: {
            padding: '10px 30px',
            display: 'flex',
            borderBottom: '1px solid #efefef',
            '& > div:first-child': {
                marginRight: '5px'
            }
        },
        summary: {
            marginRight: '5px',
            '&:after': {content: '","'},
            '&:last-child:after': {display: 'none'}
        },
        downBlock: {
            padding: '20px 30px',
            '& .row': {
                lineHeight: '35px',
                padding: '0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                '& > div:last-child': {
                    textAlign: 'right',
                    fontWeight: '600'
                }
            },
            '& .row:last-child': {
                fontWeight: '600',
                borderTop: '1px #efefef solid'
            }
        },
        subTitle: {
            paddingBottom: '8px',
            fontStyle: 'italic',
            fontWeight: '400'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        tableWrapper: {
            padding: '0 30px',
            maxHeight: '424px',
            overflowY: 'auto',
            '& .row': {
                '&:first-child': {
                    fontWeight: '600'
                }
            },
            '& .dottedList': {
                padding: '15px 30px',
                position: 'relative',
                margin: '0 -30px',
                '& > div': {
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0',
                        textAlign: 'right'
                    }
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '&:hover': {
                    backgroundColor: '#efefef'
                }
            }
        },
        redirect: {
            cursor: 'pointer',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2'
        },
        red: {
            color: '#e57373',
            fontWeight: '600'
        },
        green: {
            color: '#81c784',
            fontWeight: '600'
        },
        emptyQuery: {
            marginBottom: '15px',
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
    reduxForm({
        form: 'BrandCreateForm',
        enableReinitialize: true
    })
)
const headerStyle = {
    backgroundColor: '#fff',
    fontWeight: '600',
    color: '#666'
}

const ZERO = 0
const ONE = 0.01
const ExpenditureTransactionDialog = enhance((props) => {
    const {open, loading, onClose, classes, data, filterTransaction, userName, isOutcome, detail, detailLoading} = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const groupByCurrency = _.groupBy(detail, 'name')
    const list = _.map(data, (item) => {
        const id = isOutcome ? _.get(item, 'id') : _.get(item, ['transaction', 'id'])
        const date = dateFormat(isOutcome ? _.get(item, ['createdDate']) : _.get(item, ['transaction', 'date']))
        const amount = _.toNumber(_.get(item, 'amount'))
        const currency = _.get(item, ['currency', 'name'])
        const internalAmount = _.toNumber(isOutcome ? _.get(item, ['internalAmount']) : _.get(item, ['transaction', 'internalAmount']))
        const internal = isOutcome ? _.get(item, ['internalAmount']) : (_.get(item, ['internal']))
        const customRate = (isOutcome
            ? _.toNumber(_.get(item, 'customRate'))
            : _.toNumber(_.get(item, ['transaction', 'customRate']))) || _.toNumber(amount / internalAmount)
        const comment = isOutcome ? _.get(item, 'comment') : _.get(item, ['transaction', 'comment'])
        const cashbox = isOutcome ? _.get(item, ['cashbox', 'name']) : _.get(item, ['transaction', 'cashbox', 'name'])
        const transactionId = _.get(item, ['transaction', 'id'])
        const order = _.get(item, 'order')
        const supply = _.get(item, 'supply')
        const supplyExpenseId = _.get(item, 'supplyExpenseId')
        const transType = isOutcome
            ? _.toInteger(_.get(item, 'type'))
            : _.toInteger(_.get(item, ['transaction', 'type']))
        const user = _.get(item, 'user')
        const client = _.get(item, ['client'])
        const expenseCategory = _.get(item, ['expenseCategory'])
        return (
            <Row key={id}
                 className="dottedList"
                 style={{cursor: isOutcome ? 'unset' : 'pointer'}}>
                <Col xs={1}>{id}</Col>
                {!isOutcome && <Link target={'_blank'} className={classes.redirect} to={{
                    pathname: ROUTES.TRANSACTION_LIST_URL,
                    query: {[TRANSACTION_STAFF_EXPENSE_DIALOG]: transactionId}
                }}/>}
                <Col xs={2}>{cashbox}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={4}>
                    <TransactionsFormat
                        type={transType}
                        id={id}
                        expenseCategory={expenseCategory}
                        comment={comment}
                        client={client}
                        supply={supply}
                        order={order}
                        supplyExpenseId={supplyExpenseId}
                        user={user}
                    />
                </Col>
                <Col xs={3} style={{textAlign: 'right'}}>
                    <div className={amount > ZERO ? classes.green : (amount === ZERO ? '' : classes.red)}>
                        <span>{numberFormat(amount, currency)}</span>
                        {primaryCurrency !== currency &&
                        <div>{internal < ONE ? _.replace(internal, '.', ',') + ' ' + primaryCurrency : numberFormat(internal, primaryCurrency)}
                            <span style={{
                                fontSize: 11,
                                color: '#666',
                                fontWeight: 600
                            }}> ({numberFormat(customRate)})</span>
                        </div>}
                    </div>
                </Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '600px'} : {width: '900px', maxWidth: 'unset'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            {loading || detailLoading
                ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                : <div>
                    <div className={classes.titleContent}>
                        <div>{userName}</div>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.titleSummary}>
                            <div><strong>{t('Общая сумма')}:</strong></div>
                            {_.map(groupByCurrency, (item, index) => {
                                const amount = _.sumBy(item, (obj) => _.toNumber(_.get(obj, 'amount')))
                                return (
                                    <div key={index}
                                         className={classes.summary + ' ' + (amount < ZERO ? classes.red : amount > ZERO ? classes.green : '')}>
                                        {numberFormat(amount, index)}
                                    </div>
                                )
                            })}
                        </div>
                        <div className={classes.tableWrapper}>
                            <Row style={headerStyle} className="dottedList">
                                <Col xs={1}>№</Col>
                                <Col xs={2}>{t('Касса')}</Col>
                                <Col xs={2}>{t('Дата')}</Col>
                                <Col xs={4}>{t('Описание')}</Col>
                                <Col xs={3}>{t('Сумма')}</Col>
                            </Row>
                            {_.isEmpty(list)
                                ? <div className={classes.emptyQuery}>
                                    <div>{t('У данного агента в этом периоде нет заказов')}</div>
                                </div>
                                : list}
                        </div>
                        <GridListNavPagination filter={filterTransaction}/>
                    </div>
                </div>}
        </Dialog>
    )
})

ExpenditureTransactionDialog.propTyeps = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ExpenditureTransactionDialog.defaultProps = {
    isUpdate: false
}

export default ExpenditureTransactionDialog
