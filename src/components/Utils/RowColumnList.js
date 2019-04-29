import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import _ from 'lodash'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import Dot from '../Images/dot.png'
import EmptyQuery from 'components/Utils/EmptyQuery'

const style = {
  link: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1'
  },
  listRow: {
    transition: 'background 200ms',
    margin: '0',
    width: 'auto !important',
    padding: '10px 0',
    position: 'relative',
    '&:last-child:after': {
      display: 'none'
    },
    '&:after': {
      content: '""',
      backgroundImage: 'url(' + Dot + ')',
      position: 'absolute',
      height: '2px',
      left: '0',
      right: '0',
      bottom: '0',
      marginTop: '-1px'

    },
    '& > div:last-child': {
      textAlign: 'right'
    },
    '&:hover': {
      background: '#efefef'
    }
  },
  listHeader: {
    extend: 'listRow',
    fontWeight: '600',
    '&:hover': {
      background: '#unset'
    }
  }
}

const RowColumnList = props => {
  const {classes, list, loading, detailPath, properties, filter} = props

  if (_.isEmpty(list)) {
    return (
      <EmptyQuery list={list} loading={loading} size={100}/>
    )
  }

  return (
    <React.Fragment>
      <Row className={classes.listHeader}>
        {_.map(properties, col => {
          const xs = _.get(col, 'xs')
          const path = _.get(col, 'path')
          const title = _.get(col, 'title')
          return (
            <Col key={path} xs={xs}>{title}</Col>
          )
        })}
      </Row>

      {_.map(list, item => (
        <Row key={item.id} className={classes.listRow}>
          {detailPath && <Link className={classes.link} to={{
            pathname: sprintf(detailPath, item.id),
            query: filter.getParams()
          }}/>}
          {_.map(properties, col => {
            const xs = _.get(col, 'xs')
            const path = _.get(col, 'path')
            const func = _.get(col, 'func')
            const defText = _.get(col, 'defText')
            const value = _.get(item, path)
            const label = func ? func(value, defText) : value
            return (
              <Col key={path} xs={xs}>{label}</Col>
            )
          })}
        </Row>
      ))}
    </React.Fragment>
  )
}

RowColumnList.propTypes = {
  list: PropTypes.array.isRequired,
  detailPath: PropTypes.string,
  properties: PropTypes.array.isRequired,
  filter: PropTypes.object
}

export default injectSheet(style)(RowColumnList)
