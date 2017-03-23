import _ from 'lodash'
import React from 'react'
import {Search} from 'semantic-ui-react'

class SearchField extends React.Component {
    static propTypes = {
        id: React.PropTypes.any,
        title: React.PropTypes.any.isRequired,
        value: React.PropTypes.any,
        getOptions: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func.isRequired
    }

    componentWillMount () {
        this.resetComponent()
    }

    resetComponent = () => {
        const {value, title} = this.props

        this.setState({
            isLoading: false,
            results: [],
            value: _.get(value, title) || ''
        })
    }

    handleResultSelect = (e, result) => {
        const {onChange} = this.props

        onChange(result)

        this.setState({value: result.title})
    }

    handleSearchChange = (e, value) => {
        const {getOptions, id, title} = this.props
        this.setState({
            isLoading: true,
            value
        })

        getOptions(value)
            .then((items) => {
                const results = items.map((item) => {
                    return {
                        id: _.get(item, id),
                        title: _.get(item, title)
                    }
                })

                this.setState({
                    isLoading: false,
                    results: results
                })
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                    results: []
                })
            })
    }

    render () {
        const {
            isLoading,
            value,
            results
        } = this.state

        return (
            <Search
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                placeholder={this.props.placeholder}
                results={results}
                value={value}
            />
        )
    }
}

export default SearchField
