import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer, withHandlers, lifecycle, withState} from 'recompose'
import Select from 'react-select'
import t from '../../../helpers/translate'
import 'react-select/dist/react-select.css'
const DELAY_FOR_TYPE_ATTACK = 300

const fetchList = ({state, dispatch, getOptions, getText, getValue, input}, parent) => {
  if (parent && !state.firstTime) {
    input.onChange(null)
  }
  dispatch({loading: true, firstTime: false})
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
      dispatch({dataSource: data, loading: false})
    })
}

const enhance = compose(
  injectSheet({
    wrapper: {
      height: 'auto',
      width: '100%',
      '& .is-focused:not(.is-open) > .Select-control': {
        borderBottom: 'solid 2px #5d6474',
        boxShadow: 'unset'
      }
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
        border: 'none'
      },
      '& .Select-control': {
        borderRadius: '0px',
        border: '0',
        borderBottom: '1px solid #e8e8e8',
        backgroundColor: 'unset',
        '& .Select-value': {
          paddingLeft: '0'
        },
        '& .Select-placeholder': {
          color: 'rgba(0,0,0,0.3)',
          paddingLeft: '0'
        },
        '& .Select-input': {
          paddingLeft: '0'
        }
      },
      '& .Select-input > input': {
        width: '100% !important',
        overflow: 'hidden'
      },
      '& .Select-option.is-focused, .Select-option.is-selected': {
        background: 'unset'
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
    }
  }),
  withReducer('state', 'dispatch', (state, action) => {
    return {...state, ...action}
  }, {dataSource: [], text: '', loading: false, firstTime: true, open: false}),
  withState('mount', 'setMount', false),

  withPropsOnChange((props, nextProps) => {
    const parent = _.get(props, ['parent'])
    const nextParent = _.get(nextProps, ['parent'])
    const mount = _.get(props, ['mount'])
    const nextMount = _.get(nextProps, ['mount'])
    return (parent !== nextParent && nextParent) || (mount !== nextMount && nextMount)
  }, (props) => {
    props.mount && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props, true)
  }),
  withPropsOnChange((props, nextProps) => {
    const text = _.get(props, ['state', 'text'])
    const nextText = _.get(nextProps, ['state', 'text'])
    const nextOpen = _.get(nextProps, ['state', 'open'])
    return text !== nextText && nextOpen
  }, (props) => {
    if (props.state.open) {
      return _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
    }
    return null
  }),

  withHandlers({
    valueRenderer: props => (option) => {
      const {meta: {error}} = props
      if (error) {
        return <span style={{color: 'red'}}>{option.text}</span>
      }
      return option.text
    }
  }),
  lifecycle({
    componentDidMount () {
      this.props.setMount(true)
    },
    componentWillUnmount () {
      this.props.setMount(false)
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
    meta
  } = props
  return (
    <div className={classes.wrapper}>
      <Select
        className={(meta.error && meta.touched) ? classes.selectError : classes.select}
        options={state.dataSource}
        value={input.value.value || null}
        onInputChange={text => dispatch({text: text})}
        onChange={value => { input.onChange(value) }}
        placeholder={label}
        noResultsText={t('Не найдено')}
        isLoading={state.loading}
        clearValueText={t('Очистить')}
        valueRenderer={valueRenderer}
        labelKey={'text'}
        onOpen={() => dispatch({open: true})}
        disabled={props.disabled || state.loading}
        filterOptions={options => options}
      />
      {meta.error && meta.touched && <span className={classes.error}>{meta.error}</span>}
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
