import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
  injectSheet({
    button: {
      padding: '10px',
      textAlign: 'center',
      cursor: 'pointer'
    },
    buttonWrapper: {
      borderBottom: '2px solid #efefef',
      display: 'flex',
      '& > div': {
        transition: 'border 300ms cubic-bezier(0.63, 0.03, 0.57, 0.36)',
        display: 'inherit',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    iconActive: {
      marginRight: '10px',
      '& > svg': {
        color: '#12aaeb !important',
        height: '22px',
        width: '22px'
      }
    },
    icon: {
      marginRight: '10px',
      '& > svg': {
        height: '22px',
        width: '22px'
      }
    }
  })
)

const CustomTabs = enhance((props) => {
  const {
    classes,
    tabs,
    value,
    onChangeTab,
    mainClassName
  } = props

  const child = value ? _.find(props.children, {'key': value}) : _.first(props.children)
  const tabsSize = _.size(tabs)
  const styles = {
    border: {
      borderBottom: '2px solid transparent',
      width: 'calc(100%/' + tabsSize + ')'
    },
    borderActive: {
      borderBottom: '2px solid #12aaeb',
      color: '#12aaeb',
      width: 'calc(100%/' + tabsSize + ')'
    }
  }
  return (
    <div className={mainClassName}>
      <div className={classes.buttonWrapper}>
        {_.map(tabs, (tab, index) => {
          if (tab.key === value) {
            return (
              <div
                key={index}
                onClick={() => onChangeTab(tab.key)}
                className={classes.button}
                style={styles.borderActive}>
                <span className={classes.iconActive}>{tab.icon}</span> {tab.name}
              </div>
            )
          }
          return (
            <div
              key={index}
              onClick={() => onChangeTab(tab.key)}
              className={classes.button}
              style={styles.border}>
              <span className={classes.icon}>{tab.icon}</span> {tab.name}
            </div>
          )
        })}
      </div>
      {child}
    </div>
  )
})
CustomTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChangeTab: PropTypes.func.isRequired
}
export default CustomTabs
