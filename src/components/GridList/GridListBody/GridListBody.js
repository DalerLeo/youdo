import _ from 'lodash'
import React from 'react'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import Checkbox from 'material-ui/Checkbox'
import Dot from '../../Images/dot.png'
import NotFound from '../../Images/not-found.png'
import Paper from 'material-ui/Paper'
import Loader from '../../Loader'
import t from '../../../helpers/translate'
import classNames from 'classnames'

const enhance = compose(
  injectSheet({
    loader: {
      background: '#fff',
      height: '400px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    transparentLoading: {
      extend: 'loader',
      opacity: '0'
    },
    itemsWrapper: {
      '& > div:last-child': {
        marginBottom: '100px'
      }
    },
    item: {
      height: '50px',
      padding: '0 30px',
      position: 'relative',
      transitionProperty: 'background !important',
      'padding-left': ({withCheckboxes}) => withCheckboxes ? '50px' : '30px',
      '& .row': {
        width: '100%',
        alignItems: 'center',
        height: '100%',
        margin: '0',
        wordBreak: 'break-word',
        '& > div:first-child': {
          paddingLeft: '0'
        },
        '& > div:last-child': {
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
    hoverItem: {
      extend: 'item',
      'padding-left': ({activeCheckboxes}) => activeCheckboxes ? '50px' : '30px',
      '&:hover': {
        background: '#f2f5f8 !important'
      },
      '&:active': {
        background: '#fff !important'
      }
    },
    flexibleItem: {
      extend: 'item',
      'padding-left': ({activeCheckboxes}) => activeCheckboxes ? '50px' : '30px',
      height: 'auto'
    },
    active: {
      background: '#f2f5f8 !important'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      width: '24px',
      position: 'absolute',
      top: '0',
      left: '20px',
      bottom: '0'
    },
    detail: {
      margin: '20px -15px',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      transition: 'all 400ms ease-out !important',
      zIndex: '11'
    },
    detailNoTransform: {
      boxShadow: 'none !important',
      margin: '0',
      marginTop: '-1px',
      transition: 'none !important'
    },
    emptyQuery: {
      background: 'url(' + NotFound + ') no-repeat center center',
      backgroundSize: '200px',
      padding: '230px 0 30px',
      textAlign: 'center',
      fontSize: '13px',
      color: '#666 !important',
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
        const url = filter.createURL({select: _.join(newSelects, '-')})

        hashHistory.push(url)
      }
    }
  })
)

const GridListBody = enhance((props) => {
  const {
    classes,
    filter,
    list,
    onChecked,
    detail,
    detailTransform,
    activeCheckboxes,
    flexibleRow,
    listShadow,
    listLoading,
    transparentLoading,
    hoverableList
  } = props

  const items = _.map(list, (item, index) => {
    const id = _.get(item, 'key')
    const detailId = _.get(detail, 'key')
    const selects = filter.getSelects()
    const isChecked = _.includes(selects, _.toInteger(id))
    const checkboxChecked = _
      .chain(selects)
      .find(selectId => _.toInteger(selectId) === _.toInteger(id))
      .isNumber()
      .value()

    if (id === detailId) {
      return (
        <Paper zDepth={2} className={classNames(classes.detail, {
          [classes.detailNoTransform]: !detailTransform
        })} key={index}>
          {detail}
        </Paper>
      )
    }

    return (
      <Paper
        zDepth={1}
        className={classNames({
          [classes.flexibleItem]: flexibleRow,
          [classes.hoverItem]: hoverableList,
          [classes.item]: !hoverableList && !flexibleRow,
          [classes.active]: isChecked
        })}
        key={index}
        style={!listShadow ? {boxShadow: 'none'} : {boxShadow: 'rgba(0, 0, 0, 0.12) 0px 3px 6px, rgba(0, 0, 0, 0.12) 0px 3px 4px'}}>
        <div className={classes.checkbox}>
          {activeCheckboxes && <Checkbox onCheck={onChecked(_.toInteger(id))} checked={checkboxChecked}/>}
        </div>
        {item}
      </Paper>
    )
  })
  return !_.isEmpty(items)
    ? <div className={classes.itemsWrapper}>{items}</div>
    : (listLoading
      ? <Paper
        zDepth={1}
        className={transparentLoading ? classes.transparentLoading : classes.loader}
        style={!listShadow ? {boxShadow: 'none'} : {}}
        transitionEnabled={false}>
        <Loader/>
      </Paper>
      : <Paper
        zDepth={1}
        className={classes.emptyQuery}
        style={!listShadow ? {boxShadow: 'none'} : {}}
        transitionEnabled={false}>
        <div>{t('По вашему запросу ничего не найдено')}</div>
      </Paper>)
})

export default GridListBody
