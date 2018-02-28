import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'

const enhance = compose(
    injectSheet({
        button: {
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer'
        },
        buttonWrapper: {
            display: 'flex',
            '& > div': {
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
    }),
    withState('tabValue', 'setTabValue', null)
)

const CustomTabs = enhance((props) => {
    const {
        classes,
        tabs,
        value,
        tabValue,
        setTabValue,
        onChangeTab,
        mainClassName
    } = props

    const child = tabValue ? _.find(props.children, {'key': tabValue}) : _.first(props.children)
    const tabsSize = _.size(tabs)
    const styles = {
        border: {
            border: 'unset',
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
            {_.map(tabs, (tab) => {
                if (tab.key === value) {
                    return (
                        <div
                            onClick={() => {
                                setTabValue(tab.key)
                                onChangeTab(tab.key)
                            }}
                            className={classes.button}
                            style={styles.borderActive}>
                                <span className={classes.iconActive}>{tab.icon}</span> {tab.name}
                            </div>
                    )
                }
                return (
                    <div
                        onClick={() => {
                            onChangeTab(tab.key)
                            setTabValue(tab.key)
                        }}
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
    tabs: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    onChangeTab: PropTypes.func.isRequired
}
export default CustomTabs
