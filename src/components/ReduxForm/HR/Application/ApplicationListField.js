import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import Groceries from '../../../Images/application.png'
import {connect} from 'react-redux'
import t from '../../../../helpers/translate'

const enhance = compose(
  injectSheet({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    },
    error: {
      textAlign: 'center',
      fontSize: '14px',
      color: 'red'
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& img': {
        width: '100px',
        marginBottom: '20px',
        marginTop: '25px'
      }
    },
    table: {
      marginTop: '20px',
      '& .row': {
        margin: '0',
        height: '40px',
        '&:first-child': {
          fontWeight: '600'
        },
        '&:last-child:after': {
          display: 'none'
        },
        '& > div': {
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '0 8px',
          overflow: 'hidden',
          '&:first-child': {
            paddingLeft: '0'
          },
          '&:last-child': {
            paddingRight: '0'
          }
        }
      }
    },
    subTitle: {
      fontWeight: 'bold',
      marginBottom: '5px'
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
    searchFieldCustom: {
      extend: 'inputFieldCustom',
      position: 'initial !important',
      '& label': {
        lineHeight: 'auto !important'
      }
    },
    title: {
      fontWeight: '600',
      border: 'none !important'
    },
    headers: {
      display: 'flex',
      alignItems: 'center',
      height: '40px',
      justifyContent: 'space-between',
      '& span': {
        textTransform: 'lowercase !important'
      }
    },
    background: {
      display: 'flex',
      padding: '10px',
      margin: '-20px -30px 0',
      backgroundColor: '#f1f5f8',
      position: 'relative',
      zIndex: '2',
      '& > div': {
        marginTop: '-2px !important',
        width: '30%'
      },
      '& > button > div > span': {
        padding: '0 !important'
      },
      '& > div:last-child': {
        width: '100% !important'
      },
      '& button': {
        marginTop: '10px !important'
      },
      '& > div > div > div:first-child': {
        overflow: 'hidden'
      }
    }
  }),
  connect((state) => {
    const currency = _.get(state, ['form', 'PricesCreateForm', 'values', 'currency', 'text'])
    const createdApp = _.get(state, ['application', 'create', 'data'])
    return {
      currency,
      createdApp
    }
  }), withReducer('state', 'dispatch', (state, action) => {
    return {...state, ...action}
  }, {open: false}),

  withHandlers({
    handleAdd: props => () => {
      const application = _.get(props, ['createdApp'])
      const product = _.get(props, ['product', 'input', 'value'])
      const onChange = _.get(props, ['products', 'input', 'onChange'])
      const apps = _.get(props, ['applications', 'input', 'value'])

      if (!_.isEmpty(application)) {
        let has = false
        _.map(apps, (item) => {
          if (_.get(item, 'id') === _.get(application, 'id')) {
            has = true
          }
        })
        if (!has) {
          onChange(_.union(apps, [{product}]))
          has = false
        }
      }
    },

    handleRemove: props => (listIndex) => {
      const onChange = _.get(props, ['products', 'input', 'onChange'])
      const products = _(props)
        .get(['products', 'input', 'value'])
        .filter((item, index) => index !== listIndex)

      onChange(products)
    }
  }),
)

/* _.map(products, (item, index) => {
 const product = _.get(item, ['product', 'value', 'name'])
 const measurement = _.get(item, ['product', 'value', 'measurement', 'name'])
 const amount = numberFormat(_.get(item, 'amount'), measurement)

 return (
 <Row key={index} className="dottedList">
 <Col style={{width: '70%'}}>{product}</Col>
 <Col style={{width: '20%'}}>{amount}</Col>
 <Col style={{width: '10%'}}>
 <IconButton onTouchTap={() => handleRemove(index)}>
 <DeleteIcon color="#666666"/>
 </IconButton>
 </Col>
 </Row>
 )
 }) */

const PricesListProductField = ({classes, state, dispatch, handleAdd, handleOpenAppCreateDialog, handleRemove, ...defaultProps}) => {
  const products = _.get(defaultProps, ['products', 'input', 'value']) || []
  const error = _.get(defaultProps, ['products', 'meta', 'error'])
  return (
    <div className={classes.wrapper}>
      <div>
        {!state.open && <div className={classes.headers} style={{marginTop: '-10px'}}>
          <div className={classes.title}>{t('Список заявок')}</div>
        </div>}
      </div>
      {error && <div className={classes.error}>{error}</div>}
      {!_.isEmpty(products)
        ? <div className={classes.table}>
          <div className={classes.subTitle}>Список бонусных товаров</div>
          <div>
            <Row className="dottedList">
              <Col style={{width: '70%'}}>Бонусный товар</Col>
              <Col style={{width: '20%'}}>Кол-во</Col>
            </Row>
          </div>
        </div>
        : <div className={classes.imagePlaceholder}>
          <div style={{textAlign: 'center', color: '#adadad'}}>
            <img src={Groceries} alt=""/>
            <div>Вы еще не добавили ни одной заявки. <br/> <a onClick={() => handleOpenAppCreateDialog()}>Добавить</a>?
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default enhance(PricesListProductField)
