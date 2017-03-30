import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {Link, hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import ArrowUpIcon from './ArrowUpIcon'
import ArrowDownIcon from './ArrowDownIcon'
import Checkbox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'
import './GridListHeader.css'

const iconStyle = {
    height: '15px',
    position: 'absolute',
    top: '10px',
    right: '0px',
    color: '#fff'
}

const buttonColor = {
    color: '#fff',
    minWidth: 'auto',
    padding: '0px 30px 0px 10px',
    position: 'relative'
}

const enhance = compose(
    withHandlers({
        onChecked: props => (event, isChecked) => {
            const {filter, listIds} = props
            const selects = filter.getSelects()
            const selectsInChecked = _
                .chain(selects)
                .union(listIds)
                .uniq()
                .value()
            const selectsUnChecked = _
                .chain(selects)
                .filter(itemId => !_.includes(listIds, itemId))
                .value()

            const newSelects = isChecked ? selectsInChecked : selectsUnChecked
            const url = filter.createURL({select: _.join(newSelects, ',')})

            hashHistory.push(url)
        }
    })
)

const GridListHeader = enhance((props) => {
    const {filter, column, listIds, onChecked} = props

    // Calculate row size for correct showing grid list
    const rowSize = 12
    const defaultColumnSize = Math.floor(rowSize / column.length)
    const fullSize = (defaultColumnSize * column.length)
    const firstColumnSize = rowSize !== fullSize ? rowSize - fullSize + defaultColumnSize : defaultColumnSize

    const checkboxChecked = _
        .chain(filter.getSelects())
        .filter(itemId => _.includes(listIds, itemId))
        .sortBy(itemId => itemId)
        .isEqual(_.sortBy(listIds, itemId => itemId))
        .value()

    const items = _.map(column, (item, index) => {
        const xs = index === 0 ? firstColumnSize : defaultColumnSize

        if (_.get(item, 'sorting')) {
            const name = _.get(item, 'name')
            const sortingType = filter.getSortingType(name)
            const Icon = !_.isNull(sortingType) ? sortingType ? (
                <ArrowUpIcon style={iconStyle} />
            ) : (<ArrowDownIcon style={iconStyle} />) : null

            return (
                <Col xs={xs} key={index}>
                    <Link
                        className="grid__header__sorting__button"
                        onClick={() => hashHistory.push(filter.sortingURL(name))}>
                        <FlatButton style={buttonColor}>
                            <span>{_.get(item, 'title')}</span> {Icon}
                        </FlatButton>
                    </Link>
                </Col>
            )
        }

        return (
            <Col xs={xs} key={index}>{_.get(item, 'title')}</Col>
        )
    })

    return (
        <div className="grid__header">
            <div className="grid__checkbox">
                <Checkbox onCheck={onChecked} checked={checkboxChecked} />
            </div>
            <Row>
                {items}
            </Row>
        </div>
    )
})

export default GridListHeader
