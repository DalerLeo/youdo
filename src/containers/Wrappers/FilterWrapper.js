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
          const values = _
            .chain(filterKeys)
            .mapValues(key => {
              const value = _.get(filterForm, `values.${key}`)
              const isMulti = _.isArray(value)
              if (isMulti) return _.join(value, '~')

              if (_.includes(_.lowerCase(key), 'date')) {
                const date = value || null
                return date && date.format('YYYY-MM-DD')
              }
              return value || null
            })
            .mapKeys((v, key) => _.camelCase(key))
            .value()

          filter.filterBy({
            [queryKey]: false,
            ...values
          })
        })

      return props$
        .combineLatest(({filter, ...props}) => {
          const initialValues = _
            .chain(filterKeys)
            .mapValues((key, index) => {
              const value = filter.getParam(key)
              // FOR MULTI VALUE OBJECTS
              if (_.includes(value, '~')) {
                return _.split(value, '~')
              }
              // FOR DATES OBJECT JUST SKIP THEM, TO MANAGE MANUALLY
              if (_.includes(_.lowerCase(key), 'date')) {
                return null
              }
              if (_.toNumber(value)) {
                return _.toInteger(value)
              }
              return value
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
              initialValues
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
