import {pure, createEventHandler, compose, mapPropsStream} from 'recompose'
import {replaceUrl} from '../../helpers/changeUrl'
import _ from 'lodash'
import toBoolean from '../../helpers/toBoolean'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
const FilterWrapper = params => {
  const {
    queryKey = 'openFilterDialog',
    formName = 'FilterForm',
    filterKeys
  } = params

  return compose(
    connect(state => ({
      filterForm: _.get(state, ['form', formName])
    })),

    mapPropsStream(props$ => {
      const {handler: onOpen, stream: onOpen$} = createEventHandler()
      const {handler: onClose, stream: onClose$} = createEventHandler()
      const {handler: onSubmit, stream: onSubmit$} = createEventHandler()
      const {handler: onClear, stream: onClear$} = createEventHandler()

      onOpen$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location}]) => {
          replaceUrl(filter, location.pathname, {[queryKey]: true})
        })

      onClose$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location}]) => {
          replaceUrl(filter, location.pathname, {[queryKey]: false})
        })

      onClear$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location: {pathname}, ...props}]) => {
          hashHistory.replace({pathname, queryKey: {}})
        })

      onSubmit$
        .withLatestFrom(props$)
        .subscribe(([, {filter, location, filterForm, ...props}]) => {
          const values = _.chain(filterKeys)
            .mapValues(key => {
              if (_.includes(_.lowerCase(key), 'date')) {
                const date = _.get(filterForm, `values.${key}`) || null
                return date && date.format('YYYY-MM-DD')
              }
              return _.get(filterForm, ['values', key]) || null
            })
            .mapKeys((v, key) => _.camelCase(key))
            .value()

          filter.filterBy({
            [queryKey]: false,
            ...values
          })
        })

      return props$
        .combineLatest(({updateData, updateLoading, filter, ...props}) => {
          const values = _.chain(filterKeys)
            .mapValues((key, index) => {
              if (_.includes(_.lowerCase(key), 'date')) {
                return null
              }
              if (_.toNumber(filter.getParam(key))) {
                return _.toInteger(filter.getParam(key))
              }
              return filter.getParam(key)
            })
            .mapKeys((v, key) => _.camelCase(key))
            .value()

          return ({
            filterDialog: {
              open: toBoolean(_.get(props, ['location', 'query', queryKey])),
              onOpen,
              onClose,
              onClear,
              onSubmit,
              initialValues: values
            },
            filter,
            ...props
          })
        })
    }),
    pure
  )
}

export default FilterWrapper
