import React from 'react'
import _ from 'lodash'
import {Row, Col} from 'react-flexbox-grid'
import Checkbox from 'material-ui/Checkbox'
import Paper from 'material-ui/Paper'
import './GridList.css'

const GridList = (props) => {
    const data = _.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (item) => {
        return (
            <Row className="grid__item" key={item}>
                <Col xs={3}>
                    <Row>
                        <Col xs={2}>
                            <Checkbox className="grid__checkbox" />
                        </Col>
                        <Col xs={10}>
                        Сhewing gum
                        </Col>
                    </Row>
                </Col>
                <Col xs={3}>Strawberry </Col>
                <Col xs={3}>Seven Stick</Col>
                <Col xs={3}>John Doe</Col>
            </Row>
        )
    })

    return (
        <div>
            <Row className="grid__navbar">
                <a href>
                    <span className="arrow">Show filter</span>
                </a>
            </Row>
            <Row className="grid__header">
                <Col xs={3}>
                    <Row>
                        <Col xs={2}>
                            <Checkbox className="grid__checkbox" />
                        </Col>
                        <Col xs={10}>
                            Type
                        </Col>
                    </Row>
                </Col>
                <Col xs={3}>Property</Col>
                <Col xs={3}>Name</Col>
                <Col xs={3}>Add by</Col>
            </Row>
            <Paper zDepth={2}>
                {data}
            </Paper>
        </div>
    )
}

export default GridList
