import _ from 'lodash'
import {hashHistory} from 'react-router'
import sprintf from 'sprintf'

const filter = (data, pathname, query = {}, newKeys = {}) => {
  const getKey = (key) => {
    const newItemKey = _.get(newKeys, key)
    if (newItemKey) {
      return newItemKey
    }
    return key
  }

  const params = query
  const first = 1
  const defaultPageRange = 10
  const currentPage = _.toInteger(_.get(params, getKey('page')) || first)
  const pageRange = _.toInteger(_.get(params, getKey('pageSize')) || defaultPageRange)
  const itemsCount = _.get(data, getKey('count'))

  const pageCount = Math.ceil(itemsCount / pageRange)

  const getParam = (paramName) => _.get(params, paramName)

  const getParams = (newParams) => _.assign({}, params, newParams)

  const getSelects = () => {
    return _
      .chain(getParam('select'))
      .split('-')
      .filter(item => item)
      .map((item) => _.toInteger(item))
      .value()
  }

  const paramsToQueryUrl = (paramsItems) => {
    if (_.isEmpty(paramsItems)) {
      return null
    }

    const url = _
      .chain(paramsItems)
      .keys()
      .map((key) => {
        return {
          key: key,
          value: paramsItems[key]
        }
      })
      .filter((item) => !_.isEmpty(item.value) || _.isNumber(item.value))
      .map((item) => {
        return sprintf('%s=%s', item.key, encodeURIComponent(item.value))
      })
      .reduce((result, item) => {
        return sprintf('%s&%s', result, item)
      })
      .value()

    return url ? '?' + url : null
  }

  const createURL = (newParams) => {
    const queryUrl = paramsToQueryUrl(_.assign({}, params, newParams))
    return queryUrl ? pathname + queryUrl : pathname
  }

  const prevPage = () => {
    const prevPageNumber = currentPage - first
    if (currentPage <= first) {
      return null
    }

    return createURL({[getKey('page')]: prevPageNumber})
  }

  const nextPage = () => {
    const nextPageNumber = currentPage + first
    if (pageCount < nextPageNumber) {
      return null
    }
    return createURL({[getKey('page')]: nextPageNumber})
  }

  const getSortingType = (columnSortingName) => {
    const currentOrdering = _.get(params, 'ordering')

    const columnType = _
      .chain(currentOrdering)
      .split(',')
      .filter((item) => !_.isEmpty(item))
      .map((column) => ({column: _.trimStart(column, '-'), desc: _.startsWith(column, '-')}))
      .find({column: columnSortingName})
      .get('desc')
      .value()

    return _.isUndefined(columnType) ? null : columnType
  }

  const sortingURL = (columnSortingName) => {
    const currentOrdering = _.get(params, 'ordering')
    const columnList = _
      .chain(currentOrdering)
      .split(',')
      .filter((item) => !_.isEmpty(item))
      .map((column) => ({column: _.trimStart(column, '-'), desc: _.startsWith(column, '-')}))
      .value()

    const columnSortingType = _
      .chain(columnList)
      .find({column: columnSortingName})
      .get('desc')
      .value()

    const columnSortingDesc = _.isUndefined(columnSortingType) ? false : (columnSortingType ? null : true)

    const ordering = _
      .chain(columnList)
      .filter((item) => item.column !== columnSortingName)
      .union([{column: columnSortingName, desc: columnSortingDesc}])
      .filter((item) => !_.isNull(_.get(item, 'desc')))
      .map((item) => {
        return _.get(item, 'desc') ? '-' + _.get(item, 'column') : _.get(item, 'column')
      })
      .join(',')
      .value()

    return createURL({ordering})
  }
  const clearOrdering = () => {
    const empty = ''
    return createURL({'ordering': empty})
  }

  const getCounts = () => itemsCount

  const getPageRange = () => pageRange

  const getCurrentPage = () => currentPage

  const pageItemList = () => _.range(first, pageCount + first)

  const hasPagination = () => pageCount > first

  const filterRequest = (except) => {
    const defaultExcept = {
      select: null,
      openFilterDialog: null,
      openCreateDialog: null,
      openStatSalesDialog: null,
      openCancelConfirmDialog: null,
      openSendDialog: null,
      openDefectDialog: null,
      openAcceptMarketDialog: null,
      openAcceptCashDetail: null,
      openPriceSupplyDialog: null,
      openMapDialog: null,
      openCurrency: null,
      openUser: null,
      openAcceptTransactionDialog: null,
      openUpdateMapDialog: null,
      openAddPhoto: null,
      openImagesDialog: null,
      openTransferDialog: null,
      openDeleteImageDialog: null,
      openClientCreate: null,
      openInfoDialog: null,
      tab: null,
      openConfirmDialog: null,
      openType: null,
      openCreateIncomeDialog: null,
      openPriceSetFrom: null,
      shipmentId: null,
      openShowBigImg: null,
      openIncomeDialog: null,
      openTransactionsDialog: null,
      openShortageDialog: null,
      openOrderItemReturnDialog: null,
      openSupplyExpenseCreateDialog: null,
      openReturnDialog: null,
      openSetCurrencyDialog: null,
      openReservedDialog: null,
      openHistoryDialog: null,
      openDeleteDialog: null,
      openUpdateDialog: null,
      openStatDebtorsDialog: null,
      openAcceptCashDialog: null,
      openCreateExpenseDialog: null,
      openAddCourseDialog: null,
      openClientReturnDialog: null,
      detailId: null,
      openStockReturnDialog: null,
      orderId: null,
      ingId: null,
      openDeleteProductDialog: null,
      openChangeManufacture: null,
      editMaterials: null,
      joinMarket: null,
      joinClient: null,
      createMaterials: null,
      openPopoverDialog: null,
      openAddDialog: null,
      openInfo: null,
      openAddZone: null,
      draw: null,
      zoneId: null,
      openUpdateZone: null,
      deleteZone: null,
      openSetDiscountDialog: null,
      openSuperUser: null,
      popType: null,
      openStockSupplyDialog: null,
      openStatReturnDialog: null,
      openTransactionInfo: null,
      openTransactionEditPrice: null,
      deleteTransaction: null,
      openBindAgent: null,
      unbindAgent: null,
      openRepealDialog: null,
      currentType: null,
      openRepealHistoryDialog: null,
      openCategoryPopop: null,
      openTransactionDialog: null,
      key: null,
      openSetPrice: null
    }
    return paramsToQueryUrl(_.assign({}, params, _.merge(except, defaultExcept)))
  }

  const filterBy = (newParams) => {
    const notNullParams = _.omitBy(newParams, (item) => {
      return _.isNull(item) || item === ''
    })
    hashHistory.push({
      pathname,
      query: {
        page: first,
        ...notNullParams
      }
    })
  }

  return {
    getParam,
    getParams,
    getKey,
    getCounts,
    getPageRange,
    getCurrentPage,
    getSortingType,
    getSelects,
    sortingURL,
    filterBy,
    filterRequest,
    createURL,
    prevPage,
    nextPage,
    pageItemList,
    hasPagination,
    clearOrdering
  }
}

export default filter
