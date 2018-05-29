import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import './searchfield.css'
const DELAY_FOR_TYPE_ATTACK = 300

class SearchFieldClassBased extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      open: null,
      text: '',
      loading: false,
      mount: null,
      closed: false
    }
    this.valueRenderer = this.valueRenderer.bind(this)
    this.handleOpenSelect = this.handleOpenSelect.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.fetchList = this.fetchList.bind(this)
    this.fetchItem = this.fetchItem.bind(this)
  }

  valueRenderer (option) {
    const {meta: {error}} = this.props
    if (error) {
      return <span style={{color: 'red'}}>{option.text}</span>
    }
    return option.text
  }

  handleOpenSelect () {
    this.setState({
      open: true
    })
  }

  handleInputChange (text) {
    this.setState({
      text: text
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.closed !== this.state.closed) {
      this.setState({
        closed: this.props.closed
      })
    }

    const {input} = this.props

    if ((_.get(this.state, ['text']) !== _.get(prevState, ['text']) ||
            _.get(prevState, ['open']) !== _.get(this.state, ['open'])) &&
            _.get(this.state, ['open'])) {
      this.state.open && _.debounce(this.fetchList, DELAY_FOR_TYPE_ATTACK)()
    }

    if ((!_.isEmpty(_.get(this.state, ['dataSource'])) ||
            _.get(prevProps.input, ['input', 'value']) !== _.get(input, ['value'])) &&
            _.get(input, ['value'])) {
      this.state.mount && this.fetchItem()
    }
  }
  componentDidMount () {
    this.setState({
      mount: true
    })

    if ((_.isEmpty(_.get(this.state, ['dataSource'])) &&
            _.get(this.props.input, ['value']))) {
      this.state.mount && this.fetchItem()
    }
  }

  componentWillUnmount () {
    this.setState({
      dataSource: null,
      open: null,
      text: null,
      loading: null,
      mount: null
    })
  }

  fetchItem () {
    const {input, getItem, getText, getValue} = this.props
    const finder = _.find(this.state.dataSource, {'value': input.value.value})

    if (_.isEmpty(finder) && input.value.value) {
      getItem(input.value.value).then((data) => {
        if (!_.isEmpty(data) && this.state.mount) {
          if (!this.state.closed) {
            return this.setState({
              dataSource: _.unionBy(this.state.dataSource, [{
                text: getText(data), value: getValue(data)
              }], 'value')
            })
          }
        }
        return null
      })
    }
  }

  fetchList () {
    const {getOptions, getText, getValue} = this.props
    this.setState({loading: true})

    getOptions(this.state.text)
            .then((data) => {
              return _.map(data, (item) => {
                return {
                  text: getText(item),
                  value: getValue(item)
                }
              })
            })
            .then((data) => {
              this.setState({
                loading: false,
                dataSource: data
              })
            })
  }

  render () {
    const {
            label,
            input,
            disabled,
            clearValue
        } = this.props
    const hintText = this.state.loading ? <div>Загрузка...</div> : <div>Не найдено</div>
    return (
            <div className="wrapper">
                <Select
                    className="select"
                    options={this.state.dataSource}
                    value={input.value.value || null}
                    onInputChange={text => this.handleInputChange(text)}
                    onChange={value => input.onChange(value)}
                    placeholder={label}
                    noResultsText={hintText}
                    isLoading={this.state.loading}
                    valueRenderer={option => this.valueRenderer(option)}
                    labelKey={'text'}
                    disabled={disabled}
                    onOpen={() => { this.handleOpenSelect() }}
                    closeOnSelect={true}
                    filterOptions={options => options}
                    clearable={clearValue}
                    loadingPlaceholder="Загрузка..."
                />
        </div>
    )
  }
}

SearchFieldClassBased.propTypes = {
  getText: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired
}

SearchFieldClassBased.defaultGetText = (text) => {
  return (obj) => {
    return _.get(obj, text)
  }
}

SearchFieldClassBased.defaultGetValue = (value) => {
  return (obj) => {
    return _.get(obj, value)
  }
}

export default SearchFieldClassBased
