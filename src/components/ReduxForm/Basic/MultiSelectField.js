import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import {compose, withPropsOnChange, withReducer, withHandlers} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
const DELAY_FOR_TYPE_ATTACK = 300
import t from '../../../helpers/translate'

const fetchList = ({state, dispatch, getOptions, getText, getValue, input}) => {
  const newValues = _.map(input.value, (item) => {
    return {
      value: item
    }
  })
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
      const selectedValues = _.intersectionBy(state.dataSource, newValues, 'value')
      dispatch({dataSource: _.unionBy(data, selectedValues, 'value'), loading: false})
    })
}

const enhance = compose(
  injectSheet({
    wrapper: {
      marginTop: '5px',
      minHeight: 52,
      position: 'relative',
      width: '100%',
      '& .is-focused:not(.is-open) > .Select-control': {
        borderBottom: 'solid 2px #5d6474',
        boxShadow: 'unset'
      },
      '& > div:first-child': {
        position: 'absolute',
        top: 30,
        color: 'rgba(0, 0, 0, 0.3)',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        MozTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        WebkitTransition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        transformOrigin: 'left top 0px',
        transform: 'scale(1)'
      }
    },
    label: {
      top: '0 !important',
      transform: 'scale(0.75) !important'
    },
    labelColor: {
      color: 'rgb(93, 100, 116) !important'
    },
    select: {
      paddingTop: 18,
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
        marginBottom: '8px',
        '& .Select-value': {
          paddingLeft: '0',
          margin: '0 5px 5px 0',
          backgroundColor: '#f2f5f8',
          borderColor: '#efefef',
          color: '#666666',
          '& .Select-value-icon': {
            padding: '2px 5px',
            borderColor: '#efefef',
            '&:hover': {
              backgroundColor: 'rgba(45, 48, 55, 0.08)',
              color: '#5d6474'
            }
          }
        },
        '& .Select-placeholder': {
          color: 'rgba(0,0,0,0.3)',
          paddingLeft: '0',
          top: '12px'
        },
        '& .Select-input': {
          marginLeft: 0
        },
        '& .Select--multi .Select-value': {
          backgroundColor: '#f2f5f8',
          borderColor: '#efefef',
          color: '#6666666'
        }
      },
      '& .Select-input > input': {
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
    },
    filterOptionRender: props => (options) => {
      const {input} = props
      const newValues = _.map(input.value, (item) => {
        return {
          value: item
        }
      })
      return _.differenceBy(options, newValues, 'value')
    },
    handleChange: props => (options) => {
      const {input} = props
      const arrValues = _.map(options, (item) => {
        return item.value
      })
      if (!_.isEmpty(options)) {
        input.onChange(arrValues)
      }
      if (_.isEmpty(options)) {
        input.onChange([])
      }
    }
  }),
  withPropsOnChange((props, nextProps) => {
    return (_.get(props, ['state', 'text']) !== _.get(nextProps, ['state', 'text']) ||
            _.get(props, ['state', 'open']) !== _.get(nextProps, ['state', 'open'])) &&
            _.get(nextProps, ['state', 'open'])
  }, (props) => props.state.open && _.debounce(fetchList, DELAY_FOR_TYPE_ATTACK)(props)),

  withPropsOnChange((props, nextProps) => {
    return !_.isEmpty(_.get(nextProps, ['state', 'dataSource'])) && _.get(nextProps, ['input', 'value']) &&
            _.get(props, ['state', 'loading']) !== _.get(nextProps, ['state', 'loading'])
  }, (props) => {
    const {state, input, dispatch, getText, getValue, getIdsOption} = props
    const items = _.join(_.get(input, 'value'), '-')
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
                text: getText(item),
                value: getValue(item)
              }
            }), 'value')
          })
        })
    }
  }),
)

const MultiSelectField = enhance((props) => {
  const {
    classes,
    label,
    state,
    dispatch,
    valueRenderer,
    handleChange,
    disabled,
    input,
    meta,
    filterOptionRender
  } = props
  const hintText = state.loading ? <div>{t('Загрузка')}...</div> : <div>{t('Не найдено')}</div>

  return (
    <div className={classes.wrapper}>
      <div className={classNames({
        [classes.label]: meta.active || !_.isEmpty(input.value),
        [classes.labelColor]: meta.active
      })}>{label}</div>
      <Select
        className={classes.select}
        options={state.dataSource}
        value={input.value}
        onInputChange={text => { dispatch({text: text}) }}
        onChange={handleChange}
        onBlur={() => input.onBlur()}
        onFocus={input.onFocus}
        removeSelected={true}
        deleteRemoves={false}
        placeholder={''}
        noResultsText={hintText}
        isLoading={state.loading}
        valueRenderer={valueRenderer}
        labelKey={'text'}
        multi
        disabled={disabled}
        filterOptions={filterOptionRender}
        loadingPlaceholder={t('Загрузка') + '...'}
        onOpen={() => dispatch({open: true})}
        clearAllText={t('Очистить')}
      />
    </div>
  )
})

MultiSelectField.defaultGetText = (text) => {
  return (obj) => {
    return _.get(obj, text)
  }
}

MultiSelectField.defaultGetValue = (value) => {
  return (obj) => {
    return _.get(obj, value)
  }
}

MultiSelectField.propTypes = {
  getText: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired
}

export default MultiSelectField
