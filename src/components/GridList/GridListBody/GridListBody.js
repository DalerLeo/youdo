import _ from 'lodash'
import React from 'react'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import Checkbox from 'material-ui/Checkbox'
import Dot from '../../Images/dot.png'
import NotFound from '../../Images/not-found.png'

const enhance = compose(
    injectSheet({
        item: {
            height: '50px',
            padding: '0 30px',
            background: '#fff',
            boxShadow: 'rgba(0, 0, 0, 0) 0 0 0, rgba(0, 0, 0, 0.227451) 0 5px 10px',
            '& .row': {
                width: '100%',
                alignItems: 'center',
                height: '100%',
                margin: '0',
                '&>div:first-child': {
                    paddingLeft: '0'
                },
                '&>div:last-child': {
                    paddingRight: '0'
                }
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
            },
            '& a': {
                color: '#333',
                fontWeight: '600'
            }

        },
        detail: {
            margin: '20px -15px !important',
            background: '#fff',
            borderBottom: '1px dotted #eee',
            alignItems: 'center',
            boxShadow: 'rgba(0, 0, 0, 0) 0 0 0, rgba(0, 0, 0, 0.227451) 0 5px 10px',
            position: 'relative',
            minHeight: '150px'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '285px',
            padding: '260px 0 0',
            textAlign: 'center',
            fontSize: '15px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
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
            {!_.isEmpty(items)
                ? <div>{items}</div>
                : <div className={classes.emptyQuery}>
                    <div>По вашему запросу ничего не найдено</div>
                  </div>}
        </div>
    )
})

export default GridListBody
