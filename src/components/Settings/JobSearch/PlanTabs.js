import React from 'react'
import PropTypes from 'prop-types'
import {hashHistory} from 'react-router'
import * as ROUTER from '../../constants/routes'
import injectSheet from 'react-jss'
import {compose, withHandlers, withState} from 'recompose'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/ApplicantTab'
import t from '../../helpers/translate'
import classNames from 'classnames'

const enhance = compose(
  injectSheet({
    tabs: {
      marginBottom: '20px',
      width: '100%',
      '& > div': {
        boxSizing: 'content-box',
        width: '100% !important',
        '&:first-child': {
          boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
          borderRadius: '2px',
          height: '62px',
          alignItems: 'center'
        },
        '&:nth-child(2)': {
          marginTop: '-3px'
        },
        '&:last-child': {
          width: '100% !important',
          padding: '0'
        }
      },
      '& button > div > div': {
        textTransform: 'initial',
        height: '62px !important',
        color: '#333',
        fontWeight: '600',
        '& > div > div': {
          textAlign: 'left',
          fontSize: '12px',
          fontWeight: '400'
        }
      }
    },
    inActive: {
      color: '#777'
    }
  }),
  withState('currentTab', 'setCurrentTab', 'pre'),
  withHandlers({
    handleTabChange: () => (tab) => {
      hashHistory.replace({pathname: ROUTER.APPLICANT_LIST_URL, query: {tab: tab}})
    }
  })
)

const StockReceiveTabList = enhance((props) => {
  const {classes, currentTab, setCurrentTab, handleTabChange} = props
  const activeTab = (tab) => currentTab === tab

  return (
    <Tabs
      inkBarStyle={{backgroundColor: '#12aaeb', height: '3px'}}
      tabItemContainerStyle={{backgroundColor: '#fff', color: '#333'}}
      className={classes.tabs}
      onChange={(value) => {
        setCurrentTab(value)
        handleTabChange(value)
      }}>
      <Tab
        label={
          <div
            className={classNames({[classes.inActive]: !activeTab(TAB.PRE_TAB)})}>
            {t('Непромодерированные')} <br/> <div>Количество: 1234</div>
          </div>}
        value={TAB.PRE_TAB}/>
      <Tab
        label={
          <div
            className={classNames({[classes.inActive]: !activeTab(TAB.ACTIVE_TAB)})}>
            {t('Активние')} <br/> <div>Количество: 234</div></div>}
        value={TAB.ACTIVE_TAB}/>
      <Tab
        label={
          <div
            className={classNames({[classes.inActive]: !activeTab(TAB.BLOCKED_TAB)})}>
            {t('Заблокированные')} <br/> <div>Количество: 123232</div>
          </div>}
        value={TAB.BLOCKED_TAB}/>
    </Tabs>
  )
})

StockReceiveTabList.propTypes = {
  tabData: PropTypes.shape({
    tab: PropTypes.string.isRequired,
    handleTabChange: PropTypes.func.isRequired
  })

}

export default StockReceiveTabList
