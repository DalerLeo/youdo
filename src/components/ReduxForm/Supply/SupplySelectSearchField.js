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
            '& .Select-menu': {
                maxHeight: '300px',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 3px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
            },
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
                border: 'unset'
            },
            '& .Select-control': {
                borderRadius: '0px',
                border: '0',
                borderBottom: '1px solid #e8e8e8',
                backgroundColor: 'unset'
            }
        }
    }),

    withHandlers({
        handleInputValue: props => (value) => {
            const {dispatch, input} = props
            input.onChange(value)
            dispatch({selectedVal: _.get(value, 'value')})
        },
        valueRenderer: props => (option) => {
            const {meta: {error}} = props
            if (error) {
                return <span style={{color: 'red'}}>{option.label}</span>
            }
            return option.label
        }
    }),
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
