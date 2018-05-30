import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer, withState, lifecycle} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import t from '../../../helpers/translate'
const DELAY_FOR_TYPE_ATTACK = 300

const fetchList = ({state, dispatch, getOptions, getText, getValue, input}) => {
  dispatch({loading: true})
  input.onChange(null)
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

const fetchItem = (props, selectedItem) => {
  const {getItem, input, dispatch} = props
  dispatch({loading: true})
  const id = _.get(selectedItem, 'value')
  if (id) {
    getItem(id)
      .then(data => {
        input.onChange({value: data})
        dispatch({loading: false})
      })
  } else {
    input.onChange(null)
    dispatch({loading: false})
  }
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
      position: 'relative',
      top: '-8px',
      color: '#f44336',
      width: '100%'
    }
  }),
  withState('mount', 'setMount', false),
  lifecycle({
    componentDidMount () {
      this.props.setMount(true)
    },
    componentWillUnmount () {
      this.props.setMount(false)
    }
  }),
  withReducer('state', 'dispatch', (state, action) => {
    return {...state, ...action}
  }, {dataSource: [], text: '', loading: false, iniValue: '', open: false}),

  withPropsOnChange(() => {
    return false
  }, (props) => {
    props.autoFetch && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
  }),
  withPropsOnChange((props, nextProps) => {
    return (((_.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text']) && _.get(nextProps, ['state', 'text']) !== '') ||
            _.get(props, ['state', 'open']) !== _.get(nextProps, ['state', 'open'])) ||
            _.get(props, ['parent']) !== _.get(nextProps, ['parent']) || _.get(props, ['stock']) !== _.get(nextProps, ['stock'])) &&
            _.get(nextProps, ['state', 'open'])
  }, (props) => {
    (props.state.open || props.autoFetch) && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
  }),
  withPropsOnChange((props, nextProps) => {
    return (!_.isEmpty(_.get(nextProps, ['state', 'dataSource'])) && _.get(props, ['input', 'value']) !== _.get(nextProps, ['input', 'value'])) &&
            _.get(nextProps, ['input', 'value'])
  }, (props) => {
    const {state, input, getItem, dispatch, getText, getValue, addProduct} = props
    const finder = _.find(state.dataSource, {'value': input.value.value})
    // Add product flag is for SearchFields of CREATE_DIALOGS which does not have initial Values
    if (_.isEmpty(finder) && input.value.value && !addProduct) {
      getItem(input.value.value).then((data) => {
        if (!_.isEmpty(data)) {
          const dataSource = _.unionBy(props.state.dataSource, [{
            text: getText(data), value: getValue(data)
          }], 'value')
          return dispatch({
            dataSource: dataSource
          })
        }
        return null
      })
    }
  }),
)

const SearchFieldCustom = enhance((props) => {
  const {
    classes,
    input,
    label,
    getValue,
    state,
    dispatch,
    disabled,
    meta
  } = props
  return (
    <div className={classes.wrapper}>
      <Select
        className={meta.error ? classes.selectError : classes.select}
        options={state.dataSource}
        value={getValue(_.get(input, ['value', 'value']))}
        onInputChange={text => { dispatch({text: text}) }}
        onChange={value => {
          value ? fetchItem(props, value) : fetchList(props)
        }}
        placeholder={label}
        noResultsText={t('Не найдено')}
        isLoading={state.loading}
        labelKey={'text'}
        onOpen={() => dispatch({open: true})}
        disabled={disabled}
        filterOptions={options => options}
      />
      {meta.error && <span className={classes.error}>{meta.error}</span>}
    </div>
  )
})

SearchFieldCustom.defaultGetText = (text) => {
  return (obj) => {
    return _.get(obj, text)
  }
}

SearchFieldCustom.defaultGetValue = (value) => {
  return (obj) => {
    return _.get(obj, value)
  }
}

SearchFieldCustom.propTypes = {
  getText: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired
}

export default SearchFieldCustom
