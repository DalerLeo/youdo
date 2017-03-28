import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {Link, hashHistory} from 'react-router'
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

const GridListHeader = (props) => {
    const {filter, column} = props
    const rowLen = 12
    const itemLen = Math.floor(rowLen / column.length)
    const firstItemLen = rowLen !== (itemLen * column.length) ? rowLen - (itemLen * column.length) + itemLen : itemLen

    const items = _.map(column, (item, index) => {
        const xs = index === 0 ? firstItemLen : itemLen

        if (_.get(item, 'sorting')) {
            const name = _.get(item, 'name')
            const sortingType = filter.getSortingType(name)
            const Icon = !_.isNull(sortingType) ? sortingType ? (
                <ArrowUpIcon style={iconStyle} />
            ) : (<ArrowDownIcon style={iconStyle} />) : null

            return (
                <Col xs={xs} key={index}>
                    <Link className="grid__header__sorting__button" onClick={() => hashHistory.push(filter.sortingURL(name))}>
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
                <Checkbox />
            </div>
            <Row>
                {items}
            </Row>
        </div>
    )
}

export default GridListHeader
