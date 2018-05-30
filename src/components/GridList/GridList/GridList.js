import _ from 'lodash'
import {compose} from 'recompose'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import Loader from '../../Loader'
import Paper from 'material-ui/Paper'
import GridListNav from '../GridListNav'
import GridListHeader from '../GridListHeader'
import GridListBody from '../GridListBody'

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'relative',
      width: '100%'
    },
    header: {
      height: '100px'
    },

    loader: {
      background: '#fff',
      height: '400px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    transparentLoading: {
      extend: 'loader',
      position: 'absolute',
      left: '0',
      right: '0',
      top: '100px',
      background: 'transparent !important'
    }
  })
)

const GridList = enhance((props) => {
  const {
    classes,
    list,
    customData,
    detail,
    detailTransform,
    filter,
    filterDialog,
    addButton,
    checkboxActions,
    extraButtons,
    activeCheckboxes,
    withCheckboxes,
    withoutRow,
    withoutSearch,
    flexibleRow,
    withoutPagination,
    listShadow,
    transparentLoading,
    hoverableList,
    scrollData
  } = props

  const header = _.get(list, 'header')
  const listItems = _.get(list, 'list')
  const loading = _.get(list, 'loading')

  const listIds = _.map(listItems, (item) => _.toInteger(_.get(item, 'key')))
  const loaderOrList = (listLoading) => {
    if (listLoading && !transparentLoading) {
      return (
        <Paper zDepth={1} className={classes.loader} style={!listShadow ? {boxShadow: 'none'} : {} }>
          <Loader/>
        </Paper>
      )
    }

    return (
      <GridListBody
        filter={filter}
        list={listItems}
        detail={detail}
        detailTransform={detailTransform}
        listLoading={listLoading}
        transparentLoading={transparentLoading}
        flexibleRow={flexibleRow}
        activeCheckboxes={activeCheckboxes}
        listShadow={listShadow}
        hoverableList={hoverableList}
      />
    )
  }

  return (
    <div className={classes.wrapper}>
      <Paper zDepth={1} className={classes.header} style={!listShadow ? {boxShadow: 'none'} : {}}>
        <GridListNav
          filter={filter}
          customData={customData}
          filterDialog={filterDialog}
          addButton={addButton}
          checkboxActions={checkboxActions}
          withoutSearch={withoutSearch}
          withoutPagination={withoutPagination}
          extraButtons={extraButtons}
          withCheckboxes={withCheckboxes}
        />
        <GridListHeader
          filter={filter}
          listIds={listIds}
          activeCheckboxes={activeCheckboxes}
          withoutRow={withoutRow}
          column={header}
          listShadow={listShadow}
          scrollData={scrollData}
        />
      </Paper>
      {loaderOrList(loading)}
      {(transparentLoading && loading) &&
            <Paper zDepth={1} className={classes.transparentLoading} style={!listShadow ? {boxShadow: 'none'} : {} }>
              <Loader/>
            </Paper>}
    </div>
  )
})

GridList.propTypes = {
  filter: PropTypes.object.isRequired,
  withCheckboxes: PropTypes.bool,
  withoutSearch: PropTypes.bool,
  withoutRow: PropTypes.bool,
  withInvoice: PropTypes.bool,
  list: PropTypes.shape({
    header: PropTypes.array.isRequired,
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  }),
  customData: PropTypes.shape({
    dialog: PropTypes.node.isRequired,
    listData: PropTypes.array.isRequired
  }),
  detail: PropTypes.node.isRequired,
  checkboxActions: PropTypes.node,
  extraButtons: PropTypes.node,
  filterDialog: PropTypes.node,
  addButton: PropTypes.node,
  printDialog: PropTypes.shape({
    openPrint: PropTypes.bool,
    handleOpenPrintDialog: PropTypes.func,
    handleClosePrintDialog: PropTypes.func
  })
}

GridList.defaultProps = {
  activeCheckboxes: false,
  withCheckboxes: false,
  withoutSearch: false,
  withInvoice: false,
  flexibleRow: false,
  withoutPagination: false,
  listShadow: true,
  transparentLoading: false,
  hoverableList: true,
  actionsDialog: null,
  extraButtons: null,
  detailTransform: true
}

export default GridList
