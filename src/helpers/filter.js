import _ from 'lodash'
import {hashHistory} from 'react-router'
import sprintf from 'sprintf'

const filter = (data, pathname, query = {}) => {
    const params = query
    const currentPage = _.toNumber(_.get(params, 'page')) || 1
    const pageRange = _.get(data, 'range') || 10
    const itemsCount = _.get(data, 'count')

    const pageCount = Math.ceil(itemsCount / pageRange)

    const getParam = (paramName) => {
        return _.get(params, paramName)
    }

    const getParams = (newParams) => {
        return _.assign({}, params, newParams)
    }

    const getSelects = () => {
        return _
            .chain(getParam('select'))
            .split(',')
            .filter(item => item)
            .map((item) => parseInt(item))
            .value()
    }

    const paramsToQueryUrl = (params) => {
        if (_.isEmpty(params)) {
            return null
        }

        const url = _
            .chain(params)
            .keys()
            .map((key) => {
                return {
                    key: key,
                    value: params[key]
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
        if (currentPage <= 1) {
            return null
        }

        return createURL({page: currentPage - 1})
    }

    const nextPage = () => {
        if (pageCount < currentPage + 1) {
            return null
        }
        return createURL({page: currentPage + 1})
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

    const getCurrentPage = () => {
        return currentPage
    }

    const pageItemList = () => {
        return _.range(1, pageCount + 1)
    }

    const hasPagination = () => {
        return pageCount > 1
    }

    const filterBy = (newParams) => {
        hashHistory.push({
            pathname,
            query: {
                ...params,
                page: 1,
                ...newParams
            }
        })
    }

    return {
        filterBy,
        getParam,
        getParams,
        getCurrentPage,
        getSortingType,
        getSelects,
        sortingURL,
        createURL,
        prevPage,
        nextPage,
        pageItemList,
        hasPagination
    }
}

export default filter
