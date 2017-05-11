import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import {Link, hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import ArrowUpIcon from './ArrowUpIcon'
import ArrowDownIcon from './ArrowDownIcon'
import Checkbox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'

const enhance = compose(
    injectSheet({
        header: {
            position: 'absolute',
            top: '50px',
            width: '100%',
            height: '50px',
            alignItems: 'center',
            background: '#5d6474',
            overflow: 'hidden',
            fontWeight: '700',
            color: '#fff',
            display: 'flex',
            boxShadow: 'rgba(0, 0, 0, 0.156863) 0 3px 10px, rgba(0, 0, 0, 0.227451) 0 3px 10px',
            '& .row': {
                width: '100%',
                '& span': {
                    lineHeight: 'normal !important'
                },
                '& button': {
                    lineHeight: 'normal !important'
                }
            }
        },
        sortingButton: {
            color: '#ffffff',
            cursor: 'pointer',
            '& hover': {
                color: '#ffffff',
                cursor: 'pointer'
            }
        },
        icon: {
            height: '15px !important',
            position: 'absolute !important',
            top: '10px !important',
            right: '0px !important',
            color: '#fff !important'
        },
        button: {
            color: '#fff !important',
            minWidth: 'auto !important',
            padding: '0px 30px 0px 0px !important',
            position: 'relative !important',
            '&:hover': {
                backgroundColor: 'transparent !important'
            },
            '& span': {
                fontWeight: '600'
            }
        }
    }),
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
    const {classes, filter, column, listIds, onChecked, withoutCheckboxes} = props

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

    const firstIndex = 0
    const items = _.map(column, (item, index) => {
        const xs = (!_.isNil(item.xs)) ? item.xs : (index === firstIndex ? firstColumnSize : defaultColumnSize)

        if (_.get(item, 'sorting')) {
            const name = _.get(item, 'name')
            const sortingType = filter.getSortingType(name)
            const Icon = !_.isNull(sortingType) ? sortingType ? (
                        <ArrowUpIcon className={classes.icon}/>
                    ) : (<ArrowDownIcon className={classes.icon}/>) : null

            return (
                <Col xs={xs} key={index}>
                    <Link
                        className={classes.sortingButton}
                        onTouchTap={() => hashHistory.push(filter.sortingURL(name))}>
                        <FlatButton className={classes.button}>
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
        <div className={classes.header}>
            <div className={classes.checkbox}>
                {withoutCheckboxes &&
                <Checkbox onCheck={onChecked} checked={checkboxChecked}/>
                }
            </div>
            <div style={{padding: '0 30px', width: '100%'}}>
                <Row>
                    {items}
                </Row>
            </div>
        </div>
    )
})

export default GridListHeader
