import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Loader from '../../Loader'
import NotFound from '../../Images/not-found.png'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import GridListNavPagination from '../../../components/GridList/GridListNavPagination'
import {TransactionsFormat} from '../../Transaction'
import t from '../../../helpers/translate'

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
    const {open, loading, onClose, classes, data, filterTransaction, beginDate, endDate, userName, isOutcome} = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const list = _.map(data, (item) => {
        const id = _.get(item, 'id')
        const date = dateFormat(isOutcome ? _.get(item, ['createdDate']) : _.get(item, ['transaction', 'createdDate']))
        const amount = _.toNumber(_.get(item, 'amount'))
        const currency = _.get(item, ['currency', 'name'])
        const internalAmount = _.toNumber(isOutcome ? _.get(item, ['internalAmount']) : _.get(item, ['transaction', 'internalAmount']))
        const internal = isOutcome ? _.get(item, ['internalAmount']) : (_.get(item, ['internal']))
        const customRate = _.get(item, ['transaction', 'customRate']) ? _.toInteger(_.get(item, ['transaction', 'customRate'])) : _.toNumber(amount / internalAmount)
        const comment = _.get(item, 'comment')
        const cashbox = isOutcome ? _.get(item, ['cashbox', 'name']) : _.get(item, ['transaction', 'cashbox', 'name'])
        const order = _.get(item, 'order')
        const supply = _.get(item, 'supply')
        const supplyExpanseId = _.get(item, 'supplyExpanseId')
        const transType = _.toInteger(_.get(item, ['transaction', 'type']))
        const user = _.get(item, 'user')
        const client = _.get(item, ['client'])
        const expenseCategory = _.get(item, ['expanseCategory'])
        return (
      <Row key={id} className="dottedList">
          <Col xs={1}>{id}</Col>
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
                supplyExpanseId={supplyExpanseId}
                user={user}
              />
          </Col>
          <Col xs={3} style={{textAlign: 'right'}}>
              <div className={amount > ZERO ? 'greenFont' : (amount === ZERO ? '' : 'redFont')}>
                  <span>{numberFormat(amount, currency)}</span>
                {primaryCurrency !== currency && <div>{internal < ONE ? _.replace(internal, '.', ',') + ' ' + primaryCurrency : numberFormat(internal, primaryCurrency)} <span
                  style={{fontSize: 11, color: '#666', fontWeight: 600}}>({numberFormat(customRate)})</span></div>}
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
      {loading
        ? <div className={classes.loader}>
            <Loader size={0.75}/>
        </div>
        : <div>
            <div className={classes.titleContent}>
                <div>
                    <div>{userName}</div>
                </div>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                <div className={classes.titleSummary}>
                    <div>{t('Период')}: <strong>{dateFormat(beginDate)} - {dateFormat(endDate)}</strong></div>
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
