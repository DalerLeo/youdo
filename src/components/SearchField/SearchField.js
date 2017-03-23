import _ from 'lodash'
import React from 'react'
import {compose, withState, withHandlers, withPropsOnChange} from 'recompose'
import {Search} from 'semantic-ui-react'

const enhance = compose(
    withState('state', 'setState', {
        loading: false,
        results: [],
        value: ''
    }),
    withPropsOnChange((props, nextProps) => {
        const value = _.get(nextProps, ['value', 'title'])
        const nextValue = _.get(nextProps, ['value', 'title'])

        return nextValue && value !== nextValue
    }, ({state, setState, input}) => {
        const title = _.get(input, ['value', 'title'])

        !!title && _.delay(() => {
            setState({
                ...state,
                value: title
            })
        })
    }),

    withHandlers({
        handleSearchChange: props => (event) => {
            const {
                input,
                getId,
                getText,
                getOptions,
                state,
                setState,
                onlySelectable
            } = props
            const value = event.target.value

            setState({
                ...state,
                value
            })

            if (onlySelectable) {
                input.onChange({})
            } else {
                input.onChange({id: null, title: value})
            }

            value && getOptions(event.target.value)
                .then((items) => {
                    const results = items.map((item) => {
                        return {
                            id: getId(item),
                            title: getText(item) || 'N/A'
                        }
                    })

                    setState({
                        value,
                        loading: false,
                        results: results
                    })
                })
                .catch(() => {
                    setState({
                        value,
                        loading: false,
                        results: []
                    })
                })
        },

        handleResultSelect: props => (event, result) => {
            const {input, state, setState} = props

            input.onChange(result)

            setState({
                ...state,
                value: _.get(result, 'title')
            })
        }
    })
)

const SearchField = enhance((props) => {
    const {
        state,
        loading,
        handleResultSelect,
        handleSearchChange,

        input
    } = props

    return (
        <Search
            {...input}
            loading={loading}
            onResultSelect={handleResultSelect}
            onSearchChange={handleSearchChange}
            results={state.results}
            value={state.value}
            onFocus={_.noop}
            onBlur={_.noop}
        />
    )
})

SearchField.defaultGetId = (id) => {
    return (item) => {
        return _.get(item, id)
    }
}

SearchField.defaultGetText = (key) => {
    return (item) => {
        return _.get(item, key)
    }
}

SearchField.defaultProps = {
    onlySelectable: false
}

SearchField.propTypes = {
    getId: React.PropTypes.func.isRequired,
    getText: React.PropTypes.func.isRequired,
    getOptions: React.PropTypes.func.isRequired,
    input: React.PropTypes.object.isRequired,
    onlySelectable: React.PropTypes.bool
}

export default SearchField
