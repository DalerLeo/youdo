import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {formattedType, ORDER, INCOME_FROM_AGENT} from '../../../constants/transactionTypes'
import Loader from '../../Loader'
import {reduxForm} from 'redux-form'
import MainStyles from '../../Styles/MainStyles'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import * as ROUTES from '../../../constants/routes'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        bodyContent: {
            padding: '10px 30px'
        }
    })),
    reduxForm({
        form: 'BrandCreateForm',
        enableReinitialize: true
    })
)

const ZERO = 0
const ExpenditureTransactionDialog = enhance((props) => {
    const {open, loading, onClose, classes, data} = props

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
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '1000px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Трансакции</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                {list}
            </div>
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
