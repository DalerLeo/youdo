import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState, withHandlers} from 'recompose'
import {hashHistory} from 'react-router'
import injectSheet from 'react-jss'
import TextField from 'material-ui/TextField'
import SearchIcon from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'

const enhance = compose(
  injectSheet({
    search: {
      position: 'relative',
      display: 'flex',
      maxWidth: '300px',
      margin: '0 auto',

      '& > div': {
        paddingRight: '35px'
      }
    },
    searchField: {
      fontSize: '13px !important'
    },
    filterEmptySearch: {
      extend: 'search',
      margin: '0 0 0 10px'
    },

    searchButton: {
      position: 'absolute !important',
      right: '-10px'
    }
  }),
  withState('search', 'setSearch', ({filter}) => filter.getParam('search')),
  withHandlers({
    onSubmit: props => (event) => {
      const {search, filter} = props
      event.preventDefault()

      hashHistory.push(filter.createURL({search}))
    }
  })
)

const GridListNavSearch = enhance(({classes, search, setSearch, onSubmit, filterIsEmpty}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className={filterIsEmpty ? classes.filterEmptySearch : classes.search}>
        <TextField
          fullWidth={true}
          hintText="Поиск"
          className={classes.searchField}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <IconButton
          iconStyle={{color: '#ccc'}}
          className={classes.searchButton}
          onClick={onSubmit}>
          <SearchIcon />
        </IconButton>
      </div>
    </form>
  )
})

GridListNavSearch.propTypes = {
  filter: PropTypes.object.isRequired,
  filterIsEmpty: PropTypes.bool.isRequired
}

export default GridListNavSearch
