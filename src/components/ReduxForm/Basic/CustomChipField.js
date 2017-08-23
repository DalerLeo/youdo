/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import Chip from 'material-ui/Chip'
import Popover from 'material-ui/Popover'
import FlatButton from 'material-ui/FlatButton'

import {compose, withHandlers, withState} from 'recompose'

const enhance = compose(
    withState('openList', 'setOpenList', false),
    withHandlers({
        handleRequestDelete: props => (key) => {
            const onChange = _.get(props, ['input', 'onChange'])
            const marketTypes = _(props)
                .get(['input', 'value'])
                .filter((item, index) => item.key !== key)

            onChange(marketTypes)
        },
        handleOpenList: props => (event, ...data) => {
            const {setOpenList} = props
            setOpenList(true)
        },

        handleCloseList: props => () => {
            const {setOpenList} = props
            setOpenList(false)
        }
    }),
)

const ChipField = enhance(({input, classes, handleRequestDelete, openList, handleOpenList, handleCloseList, anchorEl}) => {
    return (
        <div className={classes.wrapperChip}>
            <FlatButton
                label="hello"
                onClick={() => { handleOpenList() }}
            />
            <Popover className={classes.popOver}
                     open={openList}
                     anchorEl={anchorEl}
                     onRequestClose={handleCloseList}>
                {_.map(input.value, (item) => {
                    return (
                        <Chip
                            key={item.key}
                            style={{margin: 4}}
                            onRequestDelete={
                                () => { handleRequestDelete(item.key) }
                            }
                            onChange={() => { input.onChange(input.value) }}
                        >
                            {item.label}
                        </Chip>
                    )
                })}
            </Popover>

        </div>
    )
})

export default injectSheet({
    popOver: {
        width: '200px',
        height: '100px'
    },
    wrapperChip: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap'
    },
    button: {
        display: 'flex',
        border: 'solid 1px #efefef !important',
        '& button': {
            '& > div': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }
    }
})(ChipField)
