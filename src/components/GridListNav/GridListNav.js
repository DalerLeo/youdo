import _ from 'lodash'
import React from 'react'
import {Link} from 'react-router'
import {Row, Col} from 'react-flexbox-grid'
import GridListNavPagination from '../GridListNavPagination'
import GridListNavSearch from '../GridListNavSearch'
import './GridListNav.css'

const GridListNav = ({filter, actions}) => {
    const selectIsEmpty = _.isEmpty(filter.getSelects())
    const showFilterUrl = filter.createURL({filter: true})

    return (
        <div className="grid__navbar">
            {selectIsEmpty && <Row>
                <Col xs={4}>
                    <Link href={`#${showFilterUrl}`} className="grid__arrow">Show filter</Link>
                </Col>
                <Col xs={4}>
                    <GridListNavSearch filter={filter} />
                </Col>
                <Col xs={4}>
                    <GridListNavPagination filter={filter} />
                </Col>
            </Row>}

            {!selectIsEmpty && <Row className="grid__navbar__actions">
                <Col xs={1}>
                    {filter.getSelects().length} selected
                </Col>
                <Col xs={11} className="grid__navbar__actions__buttons">
                    {actions}
                </Col>
            </Row>}
        </div>
    )
}

GridListNav.propTypes = {
    filter: React.PropTypes.object.isRequired,
    actions: React.PropTypes.node.isRequired
}

export default GridListNav
