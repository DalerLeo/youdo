import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withPropsOnChange, withReducer} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

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
      width: '100%',
      height: '45px',
      '& .is-focused:not(.is-open) > .Select-control': {
        borderBottom: 'solid 2px #5d6474',
        boxShadow: 'unset'
      }
    },
    select: {
      '& .Select-menu': {
        background: '#fff',
        maxHeight: '200px',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px',
        border: 'none'
      },
      '& .Select-menu-outer': {
        overflowY: 'unset',
        zIndex: '6',
        border: 'unset',
        marginTop: '5px',
        '& ::-webkit-scrollbar': {
          width: '4px'
        }
      },
      '& .Select-control': {
        borderRadius: '0px',
        border: '0',
        paddingBottom: '1px',
        borderBottom: '1px solid rgb(224, 224, 224)',
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
        background: '#f2f5f8'
      }
    }
  }),

  withReducer('state', 'dispatch', (state, action) => {
    return {...state, ...action}
  }, {dataSource: [], text: '', loading: false, iniValue: ''}),

  withPropsOnChange((props, nextProps) => {
    return (_.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text']) && _.get(nextProps, ['state', 'text']) !== '') ||
            _.get(props, ['parent']) !== _.get(nextProps, ['parent'])
  }, (props) => {
    _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)
  })
)

const SearchFieldCustom = enhance((props) => {
  const {
    classes,
    input,
    label,
    getValue,
    state,
    dispatch,
    disabled
  } = props
  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapper}>
        <Select
          className={classes.select}
          options={state.dataSource}
          value={getValue(_.get(input, ['value', 'value']))}
          onInputChange={text => { dispatch({text: text}) }}
          onChange={value => {
            value ? fetchItem(props, value) : fetchList(props)
          }}
          placeholder={label}
          noResultsText={'Не найдено'}
          isLoading={state.loading}
          labelKey={'text'}
          disabled={disabled}
        />
      </div>
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
