import _ from 'lodash'
import React from 'react'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import Container from '../Container'
import ToolTip from '../Utils/ToolTip'
import Paper from 'material-ui/Paper'
import User from '../Images/person.png'
import NoWidgets from '../Images/choose-menu.png'
import NoData from '../Images/not-found.png'
import Filter from './Filter'
import Widgets from './Widgets'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Language from 'material-ui/svg-icons/social/public'
import {setLanguage, getLanguage} from '../../helpers/storage'
import t from '../../helpers/translate'

const refreshAction = () => {
  return {
    type: '',
    payload: Promise.resolve({})
  }
}

const enhance = compose(
  injectSheet({
    chartLoader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px'
    },
    borderBottom: {
      borderBottom: '1px #efefef solid'
    },
    wrapper: {
      position: 'absolute',
      left: '-28px',
      right: '-28px',
      top: '0',
      bottom: '-28px',
      padding: '20px 30px',
      overflowY: 'auto'
    },
    languageWrapper: {
      position: 'fixed',
      bottom: '20px',
      right: '34px',
      zIndex: '2',
      '&:hover > div:first-child': {
        opacity: '0.9',
        visibility: 'visible'
      },
      '& button': {
        width: '52px !important',
        height: '52px !important',
        '& svg': {
          height: '52px !important'
        }
      }
    },
    fabToolTip: {
      borderRadius: '2px',
      background: '#2d3037',
      color: '#fff',
      padding: '8px 21px',
      opacity: '0',
      visibility: 'hidden',
      position: 'absolute',
      right: '100%',
      top: '50%',
      lineHeight: '1.3',
      marginRight: '10px',
      transition: 'opacity 0.3s ease-out',
      transform: 'translate(0, -50%)',
      whiteSpace: 'nowrap'
    },
    header: {
      padding: '0 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px'
    },
    user: {
      display: 'flex',
      alignItems: 'center',
      '& h4': {
        marginLeft: '10px',
        marginRight: '10px',
        fontSize: '16px',
        fontWeight: '600'
      },
      '& span': {
        color: '#999',
        fontSize: '12px',
        fontWeight: '600',
        marginLeft: '-5px',
        marginRight: '10px'
      },
      '& svg': {
        cursor: 'pointer',
        width: '20px !important',
        height: '20px !important'
      }
    },
    userImage: {
      background: 'url(' + User + ') no-repeat center center',
      backgroundSize: 'cover',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      overflow: 'hidden'
    },
    buttons: {
      display: 'flex',
      alignItems: 'center'
    },
    chartsWrapper: {
      marginTop: '20px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    chartHalf: {
      width: 'calc(50% - 10px)',
      flexWrap: 'wrap',
      '& > div': {
        marginBottom: '20px',
        minWidth: 'calc(50% - 10px)',
        width: '100%'
      }
    },
    chart: {
      '& > div:last-child': {
        padding: '20px 30px'
      }
    },
    fullWidth: {
      width: '100% !important'
    },
    chartHeader: {
      padding: '15px 30px',
      fontWeight: '600'
    },
    chartStats: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '15px 30px',
      background: '#f2f5f8',
      '& > div': {
        marginRight: '20px',
        '&:last-child': {
          marginRight: '0'
        }
      }
    },
    emptyWidgets: {
      background: 'url(' + NoWidgets + ') no-repeat center 20px',
      backgroundSize: '170px',
      borderRadius: '2px',
      padding: '190px 0 20px',
      textAlign: 'center',
      fontSize: '13px',
      color: '#666'
    },
    noData: {
      extend: 'emptyWidgets',
      borderTop: '1px #efefef solid',
      background: 'url(' + NoData + ') no-repeat center 20px',
      padding: '145px 0 20px !important'
    }
  }),
  withHandlers({
    setLangAction: props => (lang) => {
      setLanguage(lang, true)
      return props.dispatch(refreshAction())
    }
  })
)

const Dashboard = enhance((props) => {
  const {
    classes,
    userData,
    filter,
    orderChart,
    ordersReturnsChart,
    agentsChart,
    financeChart,
    currencyData,
    dateInitialValues,
    widgetsForm,
    openEditPass,
    setOpenEditPass
  } = props

  // USER DATA //
  const username = _.get(userData, 'username')
  const position = _.get(userData, 'position') || 'Без должности'

  // SALES //
  const orderChartActive = _.get(orderChart, 'active')

  // ORDERS & RETURNS //

  const orderReturnActive = _.get(ordersReturnsChart, 'active')

  // AGENTS //
  const agentsChartActive = _.get(agentsChart, 'active')

  // FINANCE //
  const financeChartActive = _.get(financeChart, 'active')

  // CURRENCY DATA //
  const currencyListActive = _.get(currencyData, 'active')

  const noActiveWidgets = !orderChartActive && !orderReturnActive && !agentsChartActive && !financeChartActive && !currencyListActive

  const FAB = (
    <FloatingActionButton
      backgroundColor={'#12aaeb'}>
      <Language/>
    </FloatingActionButton>
  )
  const fabMenuStyle = {
    defaultMenu: {
      fontSize: '13px'
    },
    activeMenu: {
      color: '#12aaeb',
      fontSize: '13px',
      fontWeight: '600'
    }
  }
  const langIsUZ = getLanguage() === 'uz'
  const langIsRU = getLanguage() === 'ru'
  const langIsEN = getLanguage() === 'en'
  return (
    <Container>
      <div className={classes.wrapper}>
        <div className={classes.languageWrapper}>
          <div className={classes.fabToolTip}>{t('язык системы')}</div>
          <IconMenu
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
            iconButtonElement={FAB}>
            <MenuItem style={langIsUZ ? fabMenuStyle.activeMenu : fabMenuStyle.defaultMenu} primaryText="Ўзбекча" onClick={() => props.setLangAction('uz')}/>
            <MenuItem style={langIsRU ? fabMenuStyle.activeMenu : fabMenuStyle.defaultMenu} primaryText="Русский" onClick={() => props.setLangAction('ru')}/>
            <MenuItem style={langIsEN ? fabMenuStyle.activeMenu : fabMenuStyle.defaultMenu} primaryText="English" onClick={() => props.setLangAction('en')}/>
          </IconMenu>
        </div>

        <Paper zDepth={1} className={classes.header}>
          <div className={classes.user}>
            <div className={classes.userImage}/>
            <h4>{username}</h4>
            <span>({position})</span>
            {!openEditPass &&
                        <ToolTip position={'right'} text={'Изменить пароль'}>
                          <EditIcon color={'#666'} onClick={() => { setOpenEditPass(true) }}/>
                        </ToolTip>}

          </div>
          <div className={classes.buttons}>
            <Filter
              filter={filter}
              initialValues={dateInitialValues}/>
            <Widgets
              list={widgetsForm.list}
              loading={widgetsForm.loading}
              initialValues={widgetsForm.initialValues}/>
          </div>
        </Paper>

        <section className={classes.chartsWrapper}/>
        {noActiveWidgets &&
                <div className={classes.emptyWidgets}>
                  <div>{t('Виджеты отключены')}, <br/> {t('включите, чтобы просмотреть статистику')}</div>
                </div>}
      </div>
    </Container>
  )
})

export default Dashboard
