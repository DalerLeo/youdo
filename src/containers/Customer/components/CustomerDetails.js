import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import * as ROUTES from 'constants/routes'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import LinearProgress from 'components/LinearProgress'
import ToolTip from 'components/Utils/ToolTip'
import {BORDER_STYLE, COLOR_GREY} from 'constants/styleConstants'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import ActivateIcon from 'material-ui/svg-icons/action/check-circle'
import BlockIcon from 'material-ui/svg-icons/content/block'
import t from 'helpers/translate'
import RowColumnList from 'components/Utils/RowColumnList'
import numberFormat from 'helpers/numberFormat'
import dateFormat from 'helpers/dateFormat'

const enhance = compose(
  injectSheet({
    // DETAILS
    loader: {
      display: 'flex',
      alignItems: 'center',
      height: '100px',
      position: 'relative',
      width: '100%'
    },
    details: {
      boxShadow: '0 0 6px rgba(0, 0, 0, 0.15)',
      width: '100%'
    },
    detailTitle: {
      alignItems: 'center',
      borderBottom: BORDER_STYLE,
      display: 'flex',
      fontSize: '16px',
      fontWeight: '600',
      height: '65px',
      justifyContent: 'space-between',
      padding: '0 30px',
      position: 'relative'
    },
    closeDetail: {
      cursor: 'pointer',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '1'
    },
    detailContent: {
      display: 'flex',
      lineHeight: '1.5',
      paddingLeft: '30px'
    },
    actionButtons: {
      display: 'flex',
      zIndex: '2'
    },
    mainBlock: {
      padding: '20px 0',
      display: 'flex',
      width: '380px',
      borderRight: '1px solid #efefef',
      paddingRight: '20px'
    },

    image: {
      width: '140px',
      height: '130px',
      marginRight: '30px !important',
      position: 'relative',
      '& span:nth-child(4)': {
        position: 'relative',
        zIndex: '1'
      },
      '& span:nth-child(4):after': {
        background: 'rgba(0,0,0,0.35)',
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
      }
    },
    noImage: {
      background: '#f2f5f8',
      border: '1px #ccc dashed',
      color: '#999',
      fontSize: '11px !important',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      '& span': {
        fontSize: '11px !important',
        display: 'block',
        position: 'relative',
        height: 'auto !important',
        width: '90px !important',
        margin: '0 0 20px !important',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: '40px',
          left: '50%',
          background: '#999',
          width: '64px',
          height: '1px',
          marginLeft: '-32px'
        }
      }
    },
    detailData: {
      width: 'calc(100%)'
    },
    detailsBlock: {
      width: 'calc(100%)',
      '& .dottedList': {
        padding: '10px 0',
        '&:after': {
          left: '0.5rem',
          right: '0.5rem'
        },
        '&:first-child': {
          padding: '0 0 10px'
        },
        '&:last-child': {
          padding: '10px 0 0',
          '&:after': {
            //            Display: 'none'
          }
        }
      }
    },
    bodyTitle: {
      fontWeight: '600',
      lineHeight: '2',
      '&:first-child': {
        marginTop: '0'
      },
      '& span': {
        fontWeight: 'normal'
      }
    },
    tab: {
      marginBottom: '0',
      width: '100%',
      '& button': {
        height: '40px'
      },
      '& > div': {
        background: 'transparent !important'
      },
      '& > div:first-child': {
        borderBottom: '1px #f2f5f8 solid'
      },
      '& > div:last-child': {
        width: '100% !important',
        padding: '0'
      }
    },
    tabBody: {
      padding: '10px 30px'
    },
    tasks: {
      '& > div:first-child': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    }
  }),
)
const iconStyle = {
  icon: {
    color: COLOR_GREY,
    width: 24,
    height: 24
  },
  button: {
    width: 48,
    height: 48,
    padding: 12
  }
}
const orderProps = [
  {xs: '2', path: 'master.fullName', title: 'Мастер'},
  {xs: '2', path: 'district.name', title: 'Район'},
  {xs: '2', path: 'totalPrice', title: 'Обшая Сумма', func: numberFormat},
  {xs: '2', path: 'createdDate', title: 'Дата', func: dateFormat}
]
const CustomerDetails = enhance((props) => {
  const {
    filter,
    data,
    loading,
    classes,
    onUpdateOpen,
    onDeleteOpen,
    orderList
  } = props

  const orderData = _.get(orderList, 'list')

  const fullName = _.get(data, 'fullName')

  const phoneNumber = _.get(data, 'phoneNumber')
  if (loading) {
    return (
      <div className={classes.loader}>
        <LinearProgress/>
      </div>
    )
  }

  const actionButtons = (
    <div className={classes.actionButtons}>
      <ToolTip position="bottom" text={t('Изменить пароль')}>
        <IconButton
          onClick={onUpdateOpen}
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <EditIcon/>
        </IconButton>
      </ToolTip>
      <ToolTip position="bottom" text={t('Удалить')}>
        <IconButton
          onClick={onDeleteOpen}
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <DeleteIcon />
        </IconButton>
      </ToolTip>
      {_.get(data, 'status') === 'active' &&
      <ToolTip position="bottom" text={t('Заблокировать')}>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <BlockIcon />
        </IconButton>
      </ToolTip>}
      {_.get(data, 'status') === 'blocked' &&
      <ToolTip position="bottom" text={t('Активировать')}>
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          touch={true}>
          <ActivateIcon />
        </IconButton>
      </ToolTip>}
    </div>
  )
  return (
    <div
      className={classes.details}>
      <div className={classes.content}>
        <div className={classes.detailTitle}>
          <Link to={{
            pathname: ROUTES.CUSTOMER_LIST_URL,
            query: filter.getParams()
          }} className={classes.closeDetail}/>
          <span>{fullName} ({phoneNumber})</span>
          {actionButtons}
        </div>
        <div className={classes.detailContent}>
          <div className={classes.detailsBlock}>
            <div className={classes.tabBody}>
              <RowColumnList
                detailPath={ROUTES.ORDER_ITEM_PATH}
                properties={orderProps}
                filter={filter}
                list={orderData}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

CustomerDetails.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.object
}

export default CustomerDetails
