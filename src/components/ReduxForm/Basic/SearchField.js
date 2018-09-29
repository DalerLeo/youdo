import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import {compose, withPropsOnChange, withReducer, withHandlers} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import t from '../../../helpers/translate'
const DELAY_FOR_TYPE_ATTACK = 300

const fetchList = ({state, dispatch, getOptions, getText, getValue, input}) => {
  dispatch({loading: true})
  getOptions(state.text)
    .then((data) => {
      return _.map(data, (item) => {
        return {
          text: getText(item),
          value: getValue(item)
        }
      })
    })
    .then((data) => {
      dispatch({dataSource: data})
      dispatch({loading: false})
    })
}

const enhance = compose(
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
        top: 20,
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
    select: {
      position: 'relative',
      '& .Select-menu': {
        background: '#fff',
        maxHeight: '200px'
      },
      '& .Select-menu-outer': {
        maxHeight: '200px',
        zIndex: '99',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px',
        border: 'none',
        '& ::-webkit-scrollbar': {
          width: '4px'
        }
      },
      '& .Select-control': {
        borderRadius: '0px',
        border: '0',
        borderBottom: '1px solid #e8e8e8',
        backgroundColor: 'unset',
        height: '44px',
        marginBottom: '8px',
        '& .Select-value': {
          paddingLeft: '0',
          marginTop: '12px'
        },
        '& .Select-placeholder': {
          color: 'rgba(0,0,0,0.3)',
          paddingLeft: '0',
          top: '12px'
        },
        '& .Select-input': {
          paddingLeft: '0',
          paddingTop: '12px'
        }
      },
      '& .Select-input > input': {
        width: '100% !important',
        overflow: 'hidden'
      },
      '& .Select-option.is-focused, .Select-option.is-selected': {
        background: 'unset'
      },
      '& .Select-arrow-zone': {
        paddingTop: '12px'
      },
      '& .Select-clear-zone': {
        paddingTop: '12px'
      }
    },
    selectError: {
      extend: 'select',
      '& .Select-control': {
        borderBottom: '2px solid #f44336'
      }
    },
    error: {
      fontSize: '12px',
      marginTop: '-8px',
      color: '#f44336',
      width: '100%'
    },
    noTextError: {
      extend: 'error',
      marginTop: '0'
    }
  }),

  withReducer('state', 'dispatch', (state, action) => {
    return {...state, ...action}
  }, {dataSource: [], text: '', loading: false, open: false}),

  withHandlers({
    valueRenderer: props => (option) => {
      const {meta: {error}} = props
      if (error) {
        return <span style={{color: 'red'}}>{option.text}</span>
      }
      return option.text
    }
  }),
  withPropsOnChange((props, nextProps) => {
    return _.get(props, ['input', 'value']) !== _.get(nextProps, ['input', 'value']) && _.get(nextProps, ['withDetails'])
  }, (props) => {
    _.get(props, ['withDetails']) &&
        _.get(props, ['input', 'value']) &&
        props.getItem(_.get(props, ['input', 'value']))
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
    const {state, input, getItem, dispatch, getText, getValue} = props
    const finder = _.find(state.dataSource, {'value': input.value})
    if (_.isEmpty(finder) && input.value) {
      getItem(input.value).then((data) => {
        if (!_.isEmpty(data)) {
          return dispatch({
            dataSource: _.unionBy(props.state.dataSource, [{
              text: getText(data), value: getValue(data)
            }], 'value')
          })
        }
        return null
      })
    }
  }),
)

const SearchField = enhance((props) => {
  const {
    classes,
    label,
    state,
    dispatch,
    valueRenderer,
    input,
    disabled,
    clearValue,
    meta,
    withoutErrorText,
    placeHolder
  } = props
  const hintText = state.loading ? <div>{t('Загрузка')}...</div> : <div>{t('Не найдено')}</div>
  const inputValue = _.get(input, ['value'])
  const isEmptyValue = _.isNumber(inputValue) ? false : (_.isEmpty(inputValue) || _.isNaN(inputValue))
  return (
    <div className={classes.wrapper}>
      <div className={classNames({
        [classes.label]: meta.active || !isEmptyValue,
        [classes.labelColor]: meta.active
      })}>{label}</div>
      <Select
        className={(meta.error && meta.touched) ? classes.selectError : classes.select}
        options={state.dataSource}
        value={input.value || null}
        onInputChange={text => dispatch({text: text})}
        onChange={value => input.onChange(value.value)}
        onBlur={() => input.onBlur()}
        onFocus={input.onFocus}
        placeholder={placeHolder || ''}
        noResultsText={hintText}
        isLoading={state.loading}
        valueRenderer={valueRenderer}
        labelKey={'text'}
        disabled={disabled}
        onOpen={() => { dispatch({open: true}) }}
        closeOnSelect={true}
        filterOptions={options => options}
        clearable={clearValue}
        loadingPlaceholder={t('Загрузка') + '...'}
      />
      {meta.error && meta.touched &&
            <div className={withoutErrorText ? classes.noTextError : classes.error}>
              {withoutErrorText ? null : meta.error}
            </div>}
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
