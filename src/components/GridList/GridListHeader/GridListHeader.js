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
            fontWeight: '600',
            color: '#fff',
            display: 'flex',
            '& .row': {
                width: '100%',
                alignItems: 'center',
                '& span': {
                    lineHeight: 'normal !important'
                },
                '& button': {
                    lineHeight: 'normal !important'
                }
            }
        },
        header2: {
            top: '50px',
            width: '100%',
            height: '50px',
            alignItems: 'center',
            background: '#5d6474',
            overflow: 'hidden',
            fontWeight: '600',
            color: '#fff',
            display: 'flex',
            '& .row': {
                width: '100%',
                alignItems: 'center',
                '& span': {
                    lineHeight: 'normal !important'
                },
                '& button': {
                    lineHeight: 'normal !important'
                }
            }
        },
        fixedHeader: {
            extend: 'header',
            position: 'fixed',
            width: 'auto',
            top: '0',
            left: '112px',
            right: '32px'
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
            top: '10px',
            right: '0px',
            color: '#fff !important'
        },
        button: {
            color: '#fff !important',
            minWidth: 'auto !important',
            position: 'relative !important',
            lineHeight: 'normal !important',
            '&:hover': {
                backgroundColor: 'transparent !important'
            },
            '& span': {
                fontWeight: '600'
            }
        },
        headerPadding: {
            padding: '0 30px',
            width: '100%',
            '& .row': {
                margin: '0'
            },
            '& .row > div:first-child': {
                paddingLeft: '0'
            },
            '& .row > div:last-child': {
                paddingRight: '0'
            }
        },
        withoutRowDiv: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                padding: '0 0.5rem !important'
            },
            '& div:last-child': {
                textAlign: 'right'
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
    const {classes, filter, column, listIds, onChecked, withoutCheckboxes, withoutRow, statistics} = props

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
        const alignRight = _.get(item, 'alignRight')

        if (_.get(item, 'sorting')) {
            const name = _.get(item, 'name')
            const sortingType = filter.getSortingType(name)
            const Icon = !_.isNull(sortingType) ? sortingType ? (
                        <ArrowUpIcon style={alignRight && {right: 'auto', left: '0'}} className={classes.icon}/>
                    ) : (<ArrowDownIcon style={alignRight && {right: 'auto', left: '0'}} className={classes.icon}/>) : null

            if (withoutRow) {
                return (<Col xs={xs} style={alignRight && {textAlign: 'right'}} key={index}>
                    <Link
                        className={classes.sortingButton}
                        onTouchTap={() => hashHistory.push(filter.sortingURL(name))}>
                        <FlatButton
                            className={classes.button}
                            labelStyle={{fontSize: '13px'}}
                            style={alignRight ? {paddingRight: '0', paddingLeft: '30px', textAlign: 'right'} : {paddingRight: '30px', textAlign: 'left'}}
                            disableTouchRipple={true}>
                            <span>{_.get(item, 'title')}</span> {Icon}
                        </FlatButton>
                    </Link>
                </Col>)
            }
            return (<Col xs={xs} key={index} style={alignRight && {textAlign: 'right'}}>
                        <Link
                            className={classes.sortingButton}
                            onTouchTap={() => hashHistory.push(filter.sortingURL(name))}>
                            <FlatButton
                                className={classes.button}
                                labelStyle={{fontSize: '13px'}}
                                style={alignRight ? {paddingRight: '0', paddingLeft: '30px', textAlign: 'right'} : {paddingRight: '30px', textAlign: 'left'}}
                                disableTouchRipple={true}>
                                {alignRight && Icon} <span>{_.get(item, 'title')}</span> {!alignRight && Icon}
                            </FlatButton>
                        </Link>
                    </Col>)
        }

        return (
            <Col xs={xs} key={index}>
                {_.get(item, 'title')}
            </Col>
        )
    })
    return (
        <div className={statistics ? classes.header2 : classes.header} id="header">
            <div className={classes.checkbox}>
                {withoutCheckboxes &&
                <Checkbox onCheck={onChecked} checked={checkboxChecked}/>
                }
            </div>
            <div className={classes.headerPadding}>
                {!withoutRow && <Row>
                    {items}
                </Row>}
                {withoutRow && <div className={classes.withoutRowDiv}>
                    {items}
                </div>}
            </div>
        </div>
    )
})

export default GridListHeader
