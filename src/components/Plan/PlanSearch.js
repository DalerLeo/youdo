import React from 'react'
import {hashHistory} from 'react-router'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import TextFieldSearch from 'material-ui/TextField'
import SearchIcon from 'material-ui/svg-icons/action/search'
import injectSheet from 'react-jss'
import {compose, withState, withHandlers} from 'recompose'

const enhance = compose(
    injectSheet({
        searchWrapper: {
            padding: '10px 30px'
        },
        search: {
            border: '2px #efefef dashed',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            '& > div': {
                height: '40px !important',
                padding: '0 35px 0 10px'
            }
        },
        searchField: {
            fontSize: '13px !important',
            width: '100%',
            '& > div:first-child': {
                bottom: '8px !important'
            },
            '& hr': {
                display: 'none'
            }
        },
        searchButton: {
            position: 'absolute !important',
            alignItems: 'center',
            justifyContent: 'center',
            right: '0'
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

const iconStyle = {
    icon: {
        color: '#5d6474',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 0,
        display: 'flex'
    }
}

const PlanSearch = enhance((props) => {
    const {
        classes,
        search,
        setSearch,
        onSubmit
    } = props

    return (
        <div className={classes.searchWrapper}>
            <form onSubmit={onSubmit}>
                <div className={classes.search}>
                    <TextFieldSearch
                        name={'search'}
                        fullWidth={true}
                        hintText="Поиск агентов..."
                        className={classes.searchField}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        className={classes.searchButton}
                        disableTouchRipple={true}>
                        <SearchIcon />
                    </IconButton>
                </div>
            </form>
        </div>
    )
})

PlanSearch.PropTypes = {
    filter: PropTypes.object
}

export default PlanSearch
