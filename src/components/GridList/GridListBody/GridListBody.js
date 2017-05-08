import _ from 'lodash'
import React from 'react'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import Checkbox from 'material-ui/Checkbox'
import Dot from '../../Images/dot.png'

const enhance = compose(
    injectSheet({
        checkbox: {
            marginLeft: '10px'
        },
        item: {
            height: '50px',
            padding: '0 30px',
            background: '#fff',
            boxShadow: 'rgba(0, 0, 0, 0) 0 0 0, rgba(0, 0, 0, 0.227451) 0 5px 10px',
            '& .row': {
                width: '100%',
                alignItems: 'center',
                height: '100%'
            },
            '&:after': {
                content: '""',
                backgroundImage: 'url(' + Dot + ')',
                position: 'absolute',
                height: '2px',
                left: '0',
                right: '0',
                marginTop: '-1px'
            },
            '&:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }

        },
        detail: {
            margin: '20px -15px !important',
            background: '#fff',
            borderBottom: '1px dotted #eee',
            alignItems: 'center',
            boxShadow: 'rgba(0, 0, 0, 0) 0 0 0, rgba(0, 0, 0, 0.227451) 0 5px 10px'
        }
    }),
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
    const {classes, filter, list, onChecked, detail, withoutCheckboxes} = props

    const items = _.map(list, (item, index) => {
        const id = _.toInteger(_.get(item, 'key'))
        const detailId = _.toInteger(_.get(detail, 'key'))
        const selects = filter.getSelects()
        const checkboxChecked = _
            .chain(selects)
            .find(selectId => selectId === id)
            .isNumber()
            .value()

        if (id === detailId) {
            return (
                <Row className={classes.detail} key={index}>
                    {detail}
                </Row>
            )
        }

        return (
            <div className={classes.item} key={index}>
                    <div className={classes.checkbox}>
                        {withoutCheckboxes &&
                        <Checkbox onCheck={onChecked(id)} checked={checkboxChecked}/>
                        }
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
