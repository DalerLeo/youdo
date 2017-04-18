import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import ReactTooltip from 'react-tooltip'
import {compose, withState} from 'recompose'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative'
        },
        tooltip: {
            '&.place-left': {
                '&:after': {
                    right: '-5px !important'
                }
            }
        }
    }),
    withState('visible', 'setVisible', false)
)

const ToolTip = enhance(({classes, text, children, position}) => {
    const uniqId = _.uniqueId('tooltip_')
    return (
        <div>
            <div data-tip data-for={uniqId}>
                {children}
            </div>
            <ReactTooltip
                place={position}
                id={uniqId}
                type="dark"
                effect="solid"
                className={classes.tooltip}>
                {text}
            </ReactTooltip>
        </div>
    )
})

ToolTip.propTypes = {
    position: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}

export default ToolTip
