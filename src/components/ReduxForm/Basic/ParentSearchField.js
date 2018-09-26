import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose, withHandlers} from 'recompose'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'relative',
      width: '100%',
      height: '45px',
      '& .is-focused:not(.is-open) > .Select-control': {
        borderBottom: 'solid 2px #5d6474',
        boxShadow: 'unset'
      }
    },
    icon: {
      position: 'absolute',
      right: '0',
      top: '20px'
    },
    select: {
      '& .Select-menu-outer': {
        overflowY: 'unset',
        zIndex: '6',
        border: 'unset',
        maxHeight: '200px',
        marginTop: '5px',
        '& ::-webkit-scrollbar': {
          width: '4px'
        }
      },
      '& .Select-menu': {
        maxHeight: '200px',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 3px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
      },
      '& .Select-input': {
        paddingLeft: '0',
        '& > input': {
          width: '100% !important',
          overflow: 'hidden'
        }
      },
      '& .Select-control': {
        borderRadius: '0px',
        border: '0',
        paddingBottom: '1px',
        borderBottom: '1px solid rgb(224, 224, 224)',
        backgroundColor: 'unset'
      },
      '& .Select-placeholder': {
        color: 'rgba(0, 0, 0, 0.3)',
        paddingLeft: '0'
      },
      '& .Select-value': {
        paddingLeft: '0 !important'
      }
    }
  }),

  withHandlers({
    valueRenderer: props => (option) => {
      const {meta: {error}} = props
      if (error) {
        return <span style={{color: 'red'}}>{option.label}</span>
      }
      return option.label
    }
  })
)

const SearchField = enhance((props) => {
  const {
    classes,
    label,
    input,
    valueRenderer
  } = props
  return (
    <div className={classes.wrapper}>
      <Select.Async
        className={classes.select}
        loadOptions={props.getOptions}
        value={input.value || null}
        onChange={val => input.onChange(val)}
        placeholder={label}
        noResultsText={'Не найдено'}
        valueRenderer={valueRenderer}
        loadingPlaceholder="Загрузка..."
      />
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
  getOptions: PropTypes.func.isRequired
}

export default SearchField
