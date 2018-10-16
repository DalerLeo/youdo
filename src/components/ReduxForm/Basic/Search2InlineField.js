import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer} from 'recompose'
import Select from 'react-select2'
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
  withReducer('state', 'dispatch', (state, action) => {
    return {...state, ...action}
  }, {dataSource: [], text: '', loading: false, open: false}),

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
    (props.state.open || props.autoFetch) && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
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
  injectSheet({
    wrapper: {
      marginTop: '5px',
      position: 'relative',
      height: 'auto',
      width: '100%',
      '& > div:first-child': {
        position: 'absolute',
        top: 17,
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
      fontSize: '11px !important',
      color: '#777 !important'
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
      transition: 'all 500ms',
      border: 'none',
      borderBottom: isFocused ? 'solid 2px #5d6474 !important' : '1px solid transparent',
      background: 'transparent',
      borderRadius: '0',
      cursor: 'text',
      boxShadow: 'none',
      '& .sel__indicators': {
        transition: 'all 500ms',
        opacity: isFocused ? '1 !important' : '0',
        visibility: 'hidden'
      },
      '&:hover': {
        borderBottom: '1px solid #e8e8e8',
        '& .sel__indicators': {
          opacity: '1',
          visibility: 'visible'
        }
      }
    }
  },
  menu: (base) => ({
    ...base,
    zIndex: '3',
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
    fontWeight: '600',
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
class SearchField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      hover: false
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const {meta: {active}, input: {value}, onSubmit} = this.props
    // SAVE VALUE when focused
    const focused = active !== prevProps.meta.active && active
    if (focused) {
      this.setState({value})
    }
    // Check is_value new before going to blur
    const blurred = active !== prevProps.meta.active && !active
    if (blurred && this.state.value !== value && value) {
      onSubmit && onSubmit(value)
    }
  }
  render () {
    const {
      classes,
      label,
      state,
      dispatch,
      input,
      disabled,
      meta,
      withoutErrorText,
      placeHolder
    } = this.props
    const hintText = state.loading ? <div>Загрузка...</div> : <div>Не найдено</div>
    return (
      <div className={classes.wrapper}>
        <div className={classes.label}>{label}</div>
        <Select
          classNamePrefix={'sel'}
          styles={customStyle}
          className={(meta.error && meta.touched) ? classes.selectError : ''}
          options={state.dataSource}
          value={_.find(state.dataSource, {value: input.value})}
          onInputChange={text => dispatch({text: text})}
          onChange={value => input.onChange(value ? value.value : value)}
          onBlur={() => input.onBlur()}
          onFocus={input.onFocus}
          placeholder={placeHolder || ''}
          noOptionsMessage={() => hintText}
          isLoading={state.loading}
          getOptionLabel={value => value.text}
          isDisabled={disabled}
          onMenuOpen={() => { dispatch({open: true}) }}
          //        .isClearable={true}
          loadingMessage={() => 'Загрузка...'}
        />
        {meta.error && meta.touched &&
        <div className={withoutErrorText ? classes.noTextError : classes.error}>
          {withoutErrorText ? null : meta.error}
        </div>
        }
      </div>
    )
  }
}

SearchField.propTypes = {
  getText: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired
}

export default enhance(SearchField)
