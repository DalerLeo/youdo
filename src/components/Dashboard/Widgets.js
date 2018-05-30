import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {reduxForm} from 'redux-form'
import WidgetIcon from 'material-ui/svg-icons/image/tune'
import Drawer from 'material-ui/Drawer'
import MUICheckbox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'

export const WIDGETS_FORM_KEY = {
  SALES: 'sales',
  ORDERS: 'orders',
  AGENTS: 'agents',
  FINANCE: 'finance',
  CURRENCY: 'currency'
}

const enhance = compose(
  injectSheet({
    loader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 0',
      height: '100%'
    },
    widgetsWrapper: {
      '& header': {
        padding: '20px 30px',
        borderBottom: '1px #efefef solid',
        '& > h4': {
          fontSize: '14px',
          fontWeight: '600'
        }
      },
      '& form': {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }
    },
    switches: {
      padding: '20px 30px',
      height: '100%'
    },
    switch: {
      margin: '15px 0',
      '&:first-child': {
        marginTop: '0'
      },
      '&:last-child': {
        marginBottom: '0'
      },
      '& > div': {
        margin: '0 !important'
      }
    },
    checkBox: {
      textAlign: 'left',
      marginBottom: '10px !important',
      marginTop: '10px !important',
      '& svg:first-child': {
        fill: '#666666 !important',
        color: '#666666 !important'
      },
      '& svg:last-child': {
        fill: '#666666 !important',
        color: '#666666 !important'
      },
      '& span': {
        top: '-10px !important',
        left: '-10px !important'
      }
    }
  }),
  reduxForm({
    form: 'DashboardWidgetsForm',
    enableReinitialize: true
  }),
  withState('openDrawer', 'setOpenDrawer', false)
)

const Widgets = enhance((props) => {
  const {
    classes,
    openDrawer,
    setOpenDrawer,
    list,
    loading
  } = props

  return (
    <div className={classes.filterWrapper}>
      <Drawer
        width={340}
        docked={false}
        openSecondary={true}
        containerClassName={classes.widgetsWrapper}
        onRequestChange={() => { setOpenDrawer(false) }}
        open={openDrawer}>
        <div>
          <header>
            <h4>Настройка виджетов</h4>
          </header>
          {loading
            ? <div className={classes.loader}>
              <Loader size={0.75}/>
            </div>
            : <div className={classes.switches}>
              {_.map(_.filter(list), (item) => {
                const id = _.get(item, 'id')
                const name = _.get(item, 'name')
                const isActive = _.get(item, 'isActive')
                return (
                  <div key={id} className={classes.switch}>
                    <MUICheckbox
                      label={name}
                      className={classes.checkBox}
                      iconStyle={{width: '20px', height: '20px'}}
                      labelStyle={{lineHeight: '20px', left: '-10px'}}
                      onCheck={(event, value) => { props.handleChangeCheck(id, value) }}
                      checked={isActive}
                    />
                  </div>
                )
              })}
            </div>}
        </div>
      </Drawer>
      <FlatButton
        label="Виджеты"
        backgroundColor={'#12aaeb'}
        hoverColor={'#12aaeb'}
        rippleColor={'#fff'}
        icon={<WidgetIcon style={{width: 18, height: 18, fill: '#fff', verticalAlign: 'text-top'}}/>}
        style={{marginLeft: '10px'}}
        labelStyle={{color: '#fff', textTransform: 'none', fontWeight: '600', verticalAlign: 'baseline'}}
        onClick={() => { setOpenDrawer(true) }}/>
    </div>
  )
})

Widgets.propTypes = {}

export default Widgets
