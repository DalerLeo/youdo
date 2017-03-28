import _ from 'lodash'
import React from 'react'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import IconButton from 'material-ui/IconButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import ArrowLeftIcon from './ArrowLeftIcon'
import ArrowRightIcon from './ArrowRightIcon'
import './GridListNavPagination.css'

const enhance = compose(
    withHandlers({
        onChange: props => (event, index, value) => {
            const {filter} = props
            event.preventDefault()

            hashHistory.push(filter.createURL({pageSize: value}))
        }
    })
)
const GridListNavPagination = enhance(({onChange, filter}) => {
    const prev = filter.prevPage()
    const next = filter.nextPage()
    const pageSize = _.get(filter.getParams(), 'pageSize') || 10

    return (
        <div className="grid__navbar__pagination">
            <div className="grid__navbar__pagination__count">
                <SelectField
                    value={parseInt(pageSize)}
                    onChange={onChange}>
                    <MenuItem value={10} primaryText="10" />
                    <MenuItem value={50} primaryText="50" />
                    <MenuItem value={100} primaryText="100" />
                </SelectField>
            </div>
            <div className="grid__navbar__pagination__nav">
                <div>1 - 30 from 400</div>
                <div>
                    <IconButton
                        disabled={Boolean(next)}
                        iconStyle={{color: '#ccc'}}
                        onClick={() => prev && hashHistory.push(prev)}>
                        <ArrowLeftIcon />
                    </IconButton>

                    <IconButton
                        disabled={Boolean(next)}
                        iconStyle={{color: '#ccc'}}
                        onClick={() => next && hashHistory.push(next)}>
                        <ArrowRightIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
})

GridListNavPagination.propTypes = {
    filter: React.PropTypes.object.isRequired
}

export default GridListNavPagination
