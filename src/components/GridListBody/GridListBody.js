import _ from 'lodash'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import './GridListBody.css'

const enhance = compose(
    withHandlers({
        onChecked: props => (itemKey) => {
            return (event, isChecked) => {
                const {filter} = props
                const selectItems = filter.getSelects()

                const data = isChecked ? _.uniq(_.union([itemKey], selectItems)) : _.filter(selectItems, (item) => {
                    return item !== itemKey
                })

                hashHistory.push(filter.createURL({select: _.join(data, ',')}))
            }
        }
    })
)

const GridListBody = enhance((props) => {
    const {filter, list, onChecked} = props

    const items = _.map(list, (item, index) => {
        const key = _.get(item, 'key')
        const selectItems = filter.getSelects()
        const itemSelected = _.find(selectItems, (item) => item === key)

        return (
            <div className="grid__item" key={index}>
                <div className="grid__checkbox">
                    <Checkbox onCheck={onChecked(key)} checked={Boolean(itemSelected)} />
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
