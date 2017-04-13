import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative'
        },
        toolTip: {
            backgroundColor: '#464646',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '2px',
            marginRight: '5px',
            position: 'absolute',
            right: '-60px',
            top: '28px',
            zIndex: '9999'
        }
    }),
    withState('visible', 'setVisible', false)
)

const ToolTip = enhance(({classes, text, children, visible, setVisible}) => {
    return (
        <div
            className={classes.wrapper}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}>
            {visible && <div className={classes.toolTip}>{text}</div>}
            {children}
        </div>
    )
})

ToolTip.propTypes = {
    position: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}

export default ToolTip
