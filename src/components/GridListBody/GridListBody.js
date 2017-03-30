import _ from 'lodash'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import {Row} from 'react-flexbox-grid'
import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import './GridListBody.css'

const enhance = compose(
    withHandlers({
        onChecked: props => (id) => {
            return (event, isChecked) => {
                const {filter} = props
                const selects = filter.getSelects()
                const selectsInChecked = _
                    .chain(selects)
                    .union([id])
                    .uniq()
                    .value()
                const selectsUnChecked = _
                    .chain(selects)
                    .filter(item => id !== item)
                    .value()

                const newSelects = isChecked ? selectsInChecked : selectsUnChecked
                const url = filter.createURL({select: _.join(newSelects, ',')})

                hashHistory.push(url)
            }
        }
    })
)

const GridListBody = enhance((props) => {
    const {filter, list, onChecked, detailId} = props

    const items = _.map(list, (item, index) => {
        const id = _.toInteger(_.get(item, 'key'))
        const selects = filter.getSelects()
        const checkboxChecked = _
            .chain(selects)
            .find(item => item === id)
            .isNumber()
            .value()

        if (id === detailId) {
            return (
                <Row className="grid__detail" key={index}>
                    {item}
                </Row>
            )
        }

        return (
            <div className="grid__item" key={index}>
                <div className="grid__checkbox">
                    <Checkbox onCheck={onChecked(id)} checked={checkboxChecked} />
                </div>
                {item}
            </div>
        )
    })

    return (
        <div>
            {items}
        </div>
    )
})

export default GridListBody
