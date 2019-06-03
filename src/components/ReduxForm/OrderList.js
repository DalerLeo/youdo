import React from 'react'
import _ from 'lodash'
import fpGet from 'lodash/fp/get'
import withStyles from 'react-jss'
import {compose, withHandlers} from 'recompose'
import {UniversalSearchField, TextField} from 'components/ReduxForm'
import * as API from 'constants/api'
import IconButton from 'material-ui/IconButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import numberFormat from 'helpers/numberFormat'

const check = fpGet('value.value')
const enhance = compose(
  withHandlers({
    onAdd: props => () => {
      const service = _.get(props, 'service.input')
      const brand = _.get(props, 'brand.input')
      const amount = _.get(props, 'amount.input')
      const servicesInput = _.get(props, 'services.input')
      if (check(service) && amount.value && check(brand)) {
        servicesInput.onChange(_.union(servicesInput.value, [{service: service.value, amount: amount.value, brand: brand.value}]))
        // ItemOnChange(null)
      }
      return null
    },
    onRemove: props => (index) => {
      const servicesInput = _.get(props, 'services.input')
      servicesInput.onChange(_.filter(servicesInput.value, (item, ind) => ind !== index))
    }
  }),

  withStyles({
    smt: {
      display: 'flex',
      width: '30%',
      justifyContent: 'flex-end'
    },
    selector: {
      display: 'flex',
      '& > div': {
        marginRight: '10px'
      }
    },
    name: {
      width: '25%'
    },
    brand: {
      width: '15%'
    },
    amount: {
      width: '10%',
      textAlign: 'right'
    },
    price: {
      width: '20%',
      textAlign: 'right'
    },
    total: {
      width: '30%',
      textAlign: 'right'
    },
    list: {
      display: 'flex',
      borderBottom: '1px #999 dashed',
      lineHeight: '40px',
      padding: '0 10px',
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    listHeader: {
      display: 'flex',
      borderBottom: '1px #999 dashed',
      lineHeight: '40px',
      padding: '0 10px'
    },
    wrapper: {
      paddingLeft: '20px'
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
    }
  })
)
const OrderList = props => {
  const {classes, onAdd, onRemove} = props
  const serviceInput = _.get(props, 'service')
  const brandInput = _.get(props, 'brand')
  const amountInput = _.get(props, 'amount')
  const services = _.get(props, 'services.input.value')
  const totalPrice = _.sumBy(services, serv => {
    const amount = _.toInteger(_.get(serv, 'amount'))
    const price = _.get(serv, 'service.price')
    return amount * price
  })
  return (
    <div className={classes.wrapper}>
      <div className={classes.selector}>
        <UniversalSearchField
          label={'Выберите услугу'}
          {...serviceInput}
          listPath={API.SERVICE_LIST}
          itemPath={API.SERVICE_ITEM}/>
        <UniversalSearchField
          label={'бренд'}
          textName={'title'}
          {...brandInput}
          listPath={API.BRAND_LIST}
          itemPath={API.BRAND_ITEM}/>
        <TextField
          label={'кол-во'}
          {...amountInput}
          className={classes.inputFieldCustom}/>
        <IconButton onClick={onAdd}>
          <ActionDone/>
        </IconButton>
      </div>
      {!_.isEmpty(services) && <div style={{padding: '10px 0 20px'}}>
        <div className={classes.listHeader} style={{fontWeight: '600'}}>
          <div className={classes.name}>{'Услуга'}</div>
          <div className={classes.brand}>{'бренд'}</div>
          <div className={classes.amount}>{'кол-во'}</div>
          <div className={classes.price}>{'Цена (SUM)'}</div>
          <div style={{paddingRight: '50px'}} className={classes.total}>{'Всего (SUM)'}</div>
        </div>
        {_.map(services, (service, index) => {
          const amount = _.toInteger(_.get(service, 'amount'))
          const price = _.get(service, 'service.price')

          return (
            <div key={index} className={classes.list}>
              <div className={classes.name}>{_.get(service, 'service.text')}</div>
              <div className={classes.brand}>{_.get(service, 'brand.text')}</div>
              <div className={classes.amount}>{amount}</div>
              <div className={classes.price}>{numberFormat(price)}</div>
              <div className={classes.smt}>
                {numberFormat(amount * price)}
                <IconButton onClick={() => onRemove(index)}>
                  <DeleteIcon/>
                </IconButton>
              </div>
            </div>
          )
        })}
        <div className={classes.list} style={{fontWeight: '600'}}>
          <div>Общая сумма:</div>
          <div style={{paddingRight: '50px'}} >{numberFormat(totalPrice, 'cум')}</div>
        </div>
      </div>}
    </div>
  )
}

export default enhance(OrderList)
