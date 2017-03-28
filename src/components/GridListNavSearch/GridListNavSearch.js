import React from 'react'
import {compose, withState, withHandlers} from 'recompose'
import {hashHistory} from 'react-router'
import TextField from 'material-ui/TextField'
import SearchIcon from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import './GridListNavSearch.css'

const enhance = compose(
    withState('search', 'setSearch', ''),
    withHandlers({
        onSubmit: props => (event) => {
            const {search, filter} = props
            event.preventDefault()

            hashHistory.push(filter.createURL({search}))
        }
    })
)

const GridListNavSearch = enhance(({setSearch, onSubmit}) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="grid__navbar__search">
                <TextField
                    fullWidth={true}
                    hintText="Search"
                    onChange={(event) => setSearch(event.target.value)}
                />
                <IconButton
                    iconStyle={{color: '#ccc'}}
                    className="grid__navbar__search__button"
                    onClick={onSubmit}>
                    <SearchIcon />
                </IconButton>
            </div>
        </form>
    )
})

GridListNavSearch.propTypes = {
    filter: React.PropTypes.object.isRequired
}

export default GridListNavSearch
