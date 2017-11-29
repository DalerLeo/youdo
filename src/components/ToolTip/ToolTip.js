import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import ReactTooltip from 'react-tooltip'
import {compose, withState} from 'recompose'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
        },
        alignRightWrapper: {
            extend: 'wrapper',
            justifyContent: 'flex-end'
        },
        tooltip: {
            zIndex: '999999 !important',
            borderRadius: '2px !important',
            lineHeight: '1.3',
            '&.place-left': {
                '&:after': {
                    right: '-5px !important'
                }
            }
        }
    }),
    withState('visible', 'setVisible', false)
)

const ToolTip = enhance(({classes, text, children, position, type, disabled, alignRight}) => {
    const uniqId = _.uniqueId('tooltip_')
    return (
        <div disabled={disabled}>
            <div data-tip data-for={uniqId} className={alignRight ? classes.alignRightWrapper : classes.wrapper}>
                {children}
            </div>
            {text && <ReactTooltip
                place={position}
                id={uniqId}
                type={type || 'dark'}
                effect="solid"
                className={classes.tooltip}
                html={true}>
                {text}
            </ReactTooltip>}
        </div>
    )
})

ToolTip.propTypes = {
    position: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}

export default ToolTip
