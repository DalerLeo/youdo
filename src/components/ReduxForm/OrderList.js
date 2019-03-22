import React, {useState} from 'react'
import _ from 'lodash'
import withStyles from 'react-jss'
import {compose, withHandlers} from 'recompose'
import {UniversalSearchField} from 'components/ReduxForm'
import * as API from 'constants/api'
import IconButton from 'material-ui/IconButton'
import ActionDone from 'material-ui/svg-icons/action/done'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import numberFormat from 'helpers/numberFormat'

const enhance = compose(
  withHandlers({
    onAdd: props => () => {
      const itemInput = _.get(props, 'item.input.value')
      const itemOnChange = _.get(props, 'item.input.onChange')
      const servicesInput = _.get(props, 'services.input')
      if (itemInput) {
        servicesInput.onChange(_.union(servicesInput.value, [itemInput]))
        itemOnChange(null)
      }
      return null
    },
    onRemove: props => (id) => {
      const servicesInput = _.get(props, 'services.input')
      servicesInput.onChange(_.filter(servicesInput.value, item => item.id !== id))
    }
  }),

  withStyles({
    smt: {
      display: 'flex'
    },
    list: {
      display: 'flex',
      borderBottom: '1px #999 dashed',
      lineHeight: '40px',
      padding: '0 10px',
      justifyContent: 'space-between',
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    listHeader: {
      display: 'flex',
      borderBottom: '1px #999 dashed',
      lineHeight: '40px',
      padding: '0 10px',
      justifyContent: 'space-between'
    },
    wrapper: {
      background: '#eff9ff',
      margin: '10px -30px',
      padding: '0 30px'
    }
  })
)
const OrderList = props => {
  const {classes, onAdd, onRemove} = props
  const serviceInput = _.get(props, 'service')
  const services = _.get(props, 'services.input.value')
  const itemInput = _.get(props, 'item.input')
  return (
    <div className={classes.wrapper}>
      <div className={classes.smt}>
        <UniversalSearchField label={'Выберите услугу'} onChange={itemInput.onChange} {...serviceInput} listPath={API.SERVICE_LIST} itemPath={API.SERVICE_ITEM}/>
        <IconButton onClick={onAdd}>
          <ActionDone/>
        </IconButton>
      </div>
      {!_.isEmpty(services) && <div style={{padding: '10px 0 20px'}}>
        <div className={classes.listHeader} style={{fontWeight: '600'}}>
          <div className={classes.name}>{'Услуга'}</div>
          <div style={{paddingRight: '50px'}} className={classes.price}>{'Цена'}</div>
        </div>
        {_.map(services, service => (
          <div key={service.id} className={classes.list}>
            <div className={classes.name}>{service.name}</div>
            <div className={classes.smt}>
              {numberFormat(service.price, 'cум')}
              <IconButton onClick={() => onRemove(service.id)}>
                <DeleteIcon/>
              </IconButton>
            </div>
          </div>
        )
        )}
        <div className={classes.list} style={{fontWeight: '600'}}>
          <div>Общая сумма:</div>
          <div style={{paddingRight: '50px'}} >{numberFormat(_.sumBy(services, item => _.toInteger(item.price)), 'cум')}</div>
        </div>
      </div>}
    </div>
  )
}

export default enhance(OrderList)
