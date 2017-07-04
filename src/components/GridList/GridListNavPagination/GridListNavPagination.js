import React from 'react'
import PropTypes from 'prop-types'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import ArrowLeftIcon from './ArrowLeftIcon'
import ArrowRightIcon from './ArrowRightIcon'

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            color: '#5d6474'
        },
        customWrapper: {
            extend: 'wrapper',
            position: 'absolute',
            right: '0',
            top: '60px',
            height: '40px'
        },

        count: {
            marginRight: '15px',
            height: '54px !important',
            '& > div': {
                fontSize: '13px !important',
                marginTop: '3px !important'
            }
        },

        nav: {
            display: 'flex',
            alignItems: 'center'
        },
        gridPagination: {
            '& button': {
                padding: '0 !important',
                width: 'inherit !important',
                height: 'inherit !important',
                top: '2px'
            },
            '& button:first-child': {
                padding: '0 5px 0 10px !important'
            }
        }
    }),
    withHandlers({
        onChange: props => (event, index, value) => {
            const {filter} = props
            event.preventDefault()

            hashHistory.push(filter.createURL({pageSize: value, page: 1}))
        }
    })
)
const GridListNavPagination = enhance(({classes, onChange, filter, custom}) => {
    const prev = filter.prevPage()
    const next = filter.nextPage()
    const firstPage = 1
    const startPage = (filter.getPageRange() * (filter.getCurrentPage() - firstPage)) + firstPage
    const startEnd = filter.getCounts() < (filter.getPageRange() * filter.getCurrentPage()) ? filter.getCounts() : filter.getPageRange() * filter.getCurrentPage()

    return (
        <div className={custom ? classes.wrapper : classes.customWrapper}>
            <div className={classes.count}>
                <SelectField
                    value={filter.getPageRange()}
                    style={{width: '60px', marginTop: '10px'}}
                    underlineStyle={{border: '0px solid'}}
                    onChange={onChange}>
                    <MenuItem value={10} primaryText="10" />
                    <MenuItem value={50} primaryText="50" />
                    <MenuItem value={100} primaryText="100" />
                </SelectField>
            </div>
            <div className={classes.nav}>
                <div>{startPage} - {startEnd} из {filter.getCounts()}</div>
                <div className={classes.gridPagination}>
                    <IconButton
                        disabled={Boolean(!prev)}
                        iconStyle={{color: 'rgba(0, 0, 0, 0.56)'}}
                        onTouchTap={() => prev && hashHistory.push(prev)}>
                        <ArrowLeftIcon />
                    </IconButton>

                    <IconButton
                        disabled={Boolean(!next)}
                        iconStyle={{color: 'rgba(0, 0, 0, 0.56)'}}
                        onTouchTap={() => next && hashHistory.push(next)}>
                        <ArrowRightIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
})

GridListNavPagination.propTypes = {
    filter: PropTypes.object.isRequired
}
GridListNavPagination.defaultProps = {
    custom: false
}

export default GridListNavPagination
