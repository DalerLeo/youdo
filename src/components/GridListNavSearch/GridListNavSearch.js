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

        searchButton: {
            position: 'absolute !important',
            right: '-10px'
        }
    }),
    withState('search', 'setSearch', ''),
    withHandlers({
        onSubmit: props => (event) => {
            const {search, filter} = props
            event.preventDefault()

            hashHistory.push(filter.createURL({search}))
        }
    })
)

const GridListNavSearch = enhance(({classes, filter, setSearch, onSubmit}) => {
    const search = filter.getParam('search')

    return (
        <form onSubmit={onSubmit}>
            <div className={classes.search}>
                <TextField
                    fullWidth={true}
                    hintText="Search"
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
    filter: PropTypes.object.isRequired
}

export default GridListNavSearch
