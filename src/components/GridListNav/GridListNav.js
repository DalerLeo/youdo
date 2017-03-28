import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import GridListNavPagination from '../GridListNavPagination'
import GridListNavSearch from '../GridListNavSearch'
import './GridListNav.css'

const GridListBody = ({filter}) => {
    return (
        <Row className="grid__navbar">
            <Col xs={4}>
                <a href="/" className="grid__arrow">Show filter</a>
            </Col>
            <Col xs={4}>
                <GridListNavSearch filter={filter} />
            </Col>
            <Col xs={4}>
                <GridListNavPagination filter={filter} />
            </Col>
        </Row>
    )
}

export default GridListBody
