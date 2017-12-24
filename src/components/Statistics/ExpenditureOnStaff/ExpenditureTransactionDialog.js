import _ from 'lodash'
import sprintf from 'sprintf'
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
import {formattedType, ORDER, INCOME_FROM_AGENT} from '../../../constants/transactionTypes'
import Loader from '../../Loader'
import NotFound from '../../Images/not-found.png'
import MainStyles from '../../Styles/MainStyles'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import * as ROUTES from '../../../constants/routes'
import GridListNavPagination from '../../../components/GridList/GridListNavPagination'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
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
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #efefef',
            textTransform: 'capitalize'
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
            padding: '0 30px',
            height: '59px',
            zIndex: '999',
            '& button': {
                right: '13px',
                position: 'absolute !important'
            },
            '& div': {
                display: 'flex',
                alignItems: 'center'
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                flexBasis: '35px',
                height: '35px',
                minWidth: '30px',
                width: '35px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
            }
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
                padding: '15px 0',
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
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
    })),
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
const ExpenditureTransactionDialog = enhance((props) => {
    const {open, loading, onClose, classes, data, filterTransaction, beginDate, endDate} = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const list = _.map(data, (item) => {
        const id = _.get(item, 'id')
        const date = dateFormat(_.get(item, 'createdDate'))
        const amount = _.get(item, 'amount')
        const currency = _.get(item, ['currency', 'name'])
        const internal = _.toNumber(_.get(item, 'internal'))
        const customRate = _.get(item, 'customRate') ? _.toInteger(_.get(item, 'customRate')) : _.toInteger(amount / internal)
        const comment = _.get(item, 'comment')
        const cashbox = _.get(item, ['cashbox', 'name'])
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
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '600px'} : {width: '900px', maxWidth: 'unset'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            {loading ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                : <div>
                    <div className={classes.titleContent}>
                        <div>
                            <div>Трансакции</div>
                        </div>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.titleSummary}>
                            <div>Период: <strong>{beginDate} - {endDate}</strong></div>
                        </div>
                        <div className={classes.tableWrapper}>
                            <Row style={headerStyle} className="dottedList">
                                <Col xs={1}>№</Col>
                                <Col xs={2}>Касса</Col>
                                <Col xs={2}>Дата</Col>
                                <Col xs={4}>Описание</Col>
                                <Col xs={3}>Сумма</Col>
                            </Row>
                            {_.isEmpty(list)
                                ? <div className={classes.emptyQuery}>
                                    <div>У данного агента в этом периоде нет заказов</div>
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
