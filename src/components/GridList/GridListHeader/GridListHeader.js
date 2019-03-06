import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import {Link, hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import ArrowUpIcon from './ArrowUpIcon'
import ArrowDownIcon from './ArrowDownIcon'
import Checkbox from 'material-ui/Checkbox'
import SelectAll from 'material-ui/svg-icons/content/select-all'
import CheckedAll from 'material-ui/svg-icons/action/done-all'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const enhance = compose(
  injectSheet({
    header: {
      position: 'absolute',
      top: '50px',
      width: '100%',
      height: '50px',
      alignItems: 'center',
      background: '#37464f',
      overflow: 'hidden',
      fontWeight: '600',
      color: '#fff',
      display: 'flex',
      transition: 'padding 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
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
      transition: 'unset !important',
      position: 'fixed',
      width: 'auto',
      top: '0',
      zIndex: '10'
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
    checkbox: {
      position: 'absolute',
      left: '20px',
      width: '24px'
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
      const url = filter.createURL({select: _.join(newSelects, '-')})

      hashHistory.push(url)
    }
  })
)

const muiTheme = getMuiTheme({
  checkbox: {
    boxColor: '#fff',
    checkedColor: '#fff'
  }
})

const GridListHeader = enhance((props) => {
  const {classes, filter, column, listIds, onChecked, activeCheckboxes, withoutRow, statistics, scrollData} = props

  const LEFT_OFFSET = 112
  const RIGHT_OFFSET = 32
  const fixedHeader = _.get(scrollData, 'value', false)
  const leftOffset = _.get(scrollData, 'leftOffset') === 'standart' ? LEFT_OFFSET : _.get(scrollData, 'leftOffset')
  const rightOffset = _.get(scrollData, 'rightOffset') === 'standart' ? RIGHT_OFFSET : _.get(scrollData, 'rightOffset')

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
    const width = _.get(item, 'width')
    const sortable = _.get(item, 'sorting')
    const alignRight = _.get(item, 'alignRight')

    if (sortable) {
      const name = _.get(item, 'name')
      const sortingType = filter.getSortingType(name)
      const Icon = !_.isNull(sortingType)
        ? sortingType
          ? (<ArrowUpIcon style={alignRight && {right: 'auto', left: '0'}} className={classes.icon}/>)
          : (<ArrowDownIcon style={alignRight && {right: 'auto', left: '0'}} className={classes.icon}/>)
        : null

      if (withoutRow) {
        return (
          <div style={alignRight ? {
            textAlign: 'right',
            justifyContent: 'flex-end',
            width: width
          } : {width: width}} key={index}>
            <Link
              className={classes.sortingButton}
              onClick={() => hashHistory.push(filter.sortingURL(name))}>
              <FlatButton
                className={classes.button}
                labelStyle={{fontSize: '13px'}}
                style={alignRight ? {
                  paddingRight: '0',
                  paddingLeft: '30px',
                  textAlign: 'right',
                  justifyContent: 'flex-end'
                } : {paddingRight: '30px', textAlign: 'left'}}
                disableTouchRipple={true}>
                <span>{_.get(item, 'title')}</span> {Icon}
              </FlatButton>
            </Link>
          </div>)
      }
      return (
        <Col xs={xs} key={index} style={alignRight && {textAlign: 'right', justifyContent: 'flex-end'}}>
          <Link
            className={classes.sortingButton}
            onClick={() => hashHistory.push(filter.sortingURL(name))}>
            <FlatButton
              className={classes.button}
              labelStyle={{fontSize: '13px'}}
              style={alignRight ? {
                paddingRight: '0',
                paddingLeft: '30px',
                textAlign: 'right',
                justifyContent: 'flex-end'
              } : {paddingRight: '30px', textAlign: 'left'}}
              disableTouchRipple={true}>
              {alignRight && Icon} <span>{_.get(item, 'title')}</span> {!alignRight && Icon}
            </FlatButton>
          </Link>
        </Col>
      )
    } else if (withoutRow && !sortable) {
      return (
        <div key={index} style={alignRight ? {width: width, textAlign: 'right'} : {width: width}}>
          {_.get(item, 'title')}
        </div>
      )
    }

    return (
      <Col xs={xs} key={index} style={alignRight && {textAlign: 'right'}}>
        {_.get(item, 'title')}
      </Col>
    )
  })

  const fixedHeaderStyle = {
    left: leftOffset,
    right: rightOffset
  }

  return (
    <div
      className={statistics
        ? classes.header2
        : fixedHeader
          ? classes.fixedHeader
          : classes.header}
      style={activeCheckboxes
        ? fixedHeader ? _.merge({paddingLeft: '20px'}, fixedHeaderStyle) : {paddingLeft: '20px'}
        : fixedHeader ? fixedHeaderStyle : {}}>
      <div className={classes.checkbox}>
        {activeCheckboxes &&
                <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
                  <Checkbox
                    onCheck={onChecked}
                    checked={checkboxChecked}
                    checkedIcon={<CheckedAll/>}
                    uncheckedIcon={<SelectAll/>}/>
                </MuiThemeProvider>}
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
