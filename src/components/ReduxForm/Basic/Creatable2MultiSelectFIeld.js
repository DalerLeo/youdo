import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import {compose, withPropsOnChange, withReducer, withHandlers} from 'recompose'
import SelectCreatable from 'react-select2/lib/Creatable'
import t from '../../../helpers/translate'
const DELAY_FOR_TYPE_ATTACK = 300

const fetchList = ({state: {text, dataSource}, dispatch, getOptions, getText, getValue, input}) => {
  dispatch({loading: true})
  getOptions(text)
    .then((data) => {
      return _.map(data, (item) => {
        return {
          label: getText(item),
          value: getValue(item)
        }
      })
    })
    .then((data) => {
      const choosen = _.intersectionBy(dataSource, _.map(input.value, value => ({value})), 'value')
      const created = _.unionBy(choosen, _.filter(dataSource, {'__isNew__': true}), 'value')
      dispatch({dataSource: _.union(data, created)})
      dispatch({loading: false})
    })
}

const enhance = compose(
  withReducer('state', 'dispatch', (state, action) => {
    return {...state, ...action}
  }, {dataSource: [], text: '', loading: false, open: false}),

  withHandlers({
    getInput: props => () => {
      const {input, state: {dataSource}} = props
      const form = _.map(input.value, value => ({value}))
      return _.intersectionBy(dataSource, form, 'value')
    },
    onInputChange: props => (text) => {
      props.dispatch({text})
    },
    onChange: props => (options) => {
      const {state: {dataSource}, dispatch} = props
      dispatch({dataSource: _.unionBy(dataSource, options, 'value')})
      props.input.onChange(_.map(options, o => o.value))
    }
  }),
  withPropsOnChange((props, nextProps) => {
    const text = _.get(props, ['state', 'text'])
    const open = _.get(props, ['state', 'open'])
    const nextText = _.get(nextProps, ['state', 'text'])
    const nextOpen = _.get(nextProps, ['state', 'open'])
    return (text !== nextText || open !== nextOpen) && nextOpen
  }, (props) => {
    props.state.open && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
  }),

  withPropsOnChange((props, nextProps) => {
    return (!_.isEmpty(_.get(nextProps, ['state', 'dataSource'])) || _.get(props, ['input', 'value']) !== _.get(nextProps, ['input', 'value'])) &&
      _.get(nextProps, ['input', 'value'])
  }, (props) => {
    const {state, input, dispatch, getText, getValue, getIdsOption} = props
    const items = _.join(_.get(input, 'value'), '~')
    let notFound = true

    for (let i = 0; i < _.size(input.value); i++) {
      if (!_.find(state.dataSource, {'value': input.value[i]})) {
        notFound = true
        break
      }
      notFound = false
    }
    if (!_.isEmpty(input.value) && notFound) {
      getIdsOption(items)
        .then((data) => {
          return dispatch({
            dataSource: _.unionBy(state.dataSource, _.map(data, (item) => {
              return {
                label: getText(item),
                value: getValue(item)
              }
            }), 'value')
          })
        })
    }
  }),
  injectSheet({
    wrapper: {
      marginTop: '5px',
      position: 'relative',
      height: 'auto',
      width: '100%',
      '& .is-focused:not(.is-open) > .Select-control': {
        borderBottom: 'solid 2px #5d6474',
        boxShadow: 'unset'
      },
      '& > div:first-child': {
        position: 'absolute',
        top: 17,
        color: 'rgba(0, 0, 0, 0.3)',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        MozTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        WebkitTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        transformOrigin: 'left top 0px',
        transform: 'scale(1)'
      }
    },
    label: {
      zIndex: '2',
      top: '0 !important',
      transform: 'scale(0.75) !important'
    },
    labelColor: {
      color: 'rgb(93, 100, 116) !important'
    },
    selectError: {
      extend: 'select',
      '& .Select-control': {
        borderBottom: '2px solid #f44336'
      }
    },
    error: {
      fontSize: '12px',
      marginTop: '2px',
      color: '#f44336',
      width: '100%'
    },
    noTextError: {
      extend: 'error',
      marginTop: '0'
    }
  }),

)

const customStyle = {
  control: (base, {isFocused}) => {
    return {
      ...base,
      border: 'none',
      borderBottom: isFocused ? 'solid 2px #5d6474' : '1px solid #e8e8e8',
      background: 'transparent',
      borderRadius: '0',
      boxShadow: 'none',
      '&:hover': {
      }
    }
  },
  menu: (base) => ({
    ...base,
    zIndex: '2',
    border: 'none',
    borderRadius: '0',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px'

  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: 'transparent'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingLeft: '2px'
  }),
  clearIndicator: (base) => ({
    ...base,
    paddingRight: '2px',
    cursor: 'pointer'
  }),
  valueContainer: (base) => ({
    ...base,
    paddingLeft: 0,
    marginBottom: '-10px'
  }),
  option: (base, {isSelected}) => ({
    ...base,
    cursor: 'pointer',
    backgroundColor: isSelected ? '#efefef' : '#fff',
    color: '#000',
    '&:hover': {
      backgroundColor: '#f8f8f8'
    }
  })
}
const SearchField = enhance((props) => {
  const {
    classes,
    label,
    dispatch,
    input,
    disabled,
    meta,
    withoutErrorText,
    placeHolder,
    getInput,
    onChange,
    onInputChange,
    state: {loading, dataSource}

  } = props
  const formInput = getInput()
  const hintText = loading ? <div>Загрузка...</div> : <div>Не найдено</div>
  const inputValue = _.get(input, ['value'])
  const isEmptyValue = _.isNumber(inputValue) ? false : (_.isEmpty(inputValue) || _.isNaN(inputValue))
  return (
    <div className={classes.wrapper}>
      <div className={classNames({
        [classes.label]: meta.active || !isEmptyValue,
        [classes.labelColor]: meta.active
      })}>{label}
      </div>
      <SelectCreatable
        value={formInput}
        onChange={onChange}
        isMulti={true}
        isClearable={true}
        isDisabled={disabled}
        isLoading={loading}
        styles={customStyle}
        onFocus={input.onFocus}
        onBlur={() => input.onBlur()}
        onInputChange={onInputChange}
        options={dataSource}
        placeholder={placeHolder || ''}
        noOptionsMessage={() => hintText}
        onMenuOpen={() => dispatch({open: true})}
        formatCreateLabel={v => `Добавить: ${v}`}
        loadingMessage={() => t('Загрузка') + '...'}
        className={classNames({[classes.selectError]: meta.error && meta.touched})}
      />
      {meta.error && meta.touched &&
      <div className={withoutErrorText ? classes.noTextError : classes.error}>
        {withoutErrorText ? null : meta.error}
      </div>
      }
    </div>
  )
})

SearchField.defaultGetText = (text) => {
  return (obj) => {
    return _.get(obj, text)
  }
}

SearchField.defaultGetValue = (value) => {
  return (obj) => {
    return _.get(obj, value)
  }
}

SearchField.propTypes = {
  getText: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired
}

export default SearchField
