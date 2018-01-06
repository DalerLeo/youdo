import React from 'react'
import PropTypes from 'prop-types'
import SearchIcon from 'material-ui/svg-icons/action/search'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import t from '../../helpers/translate'

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
            width: '100%'
        },
        searchField: {
            display: 'flex',
            color: '#333',
            fontSize: '13px !important',
            width: '100%',
            '& > input': {
                border: 'none',
                outline: 'none',
                height: '35px !important',
                padding: '0 35px 0 10px'
            }
        },
        searchButton: {
            width: '35px',
            height: '35px',
            display: 'flex',
            position: 'absolute !important',
            alignItems: 'center',
            justifyContent: 'center',
            right: '0'
        }
    })
)

const iconStyle = {
    color: '#5d6474',
    width: 22,
    height: 22
}

const TrackingAgentSearch = enhance((props) => {
    const {
        classes,
        handleSearch,
        onSubmit
    } = props

    return (
        <div className={classes.searchWrapper}>
            <form onSubmit={onSubmit}>
                <div className={classes.search}>
                    <div className={classes.searchField}>
                        <input
                            type="text"
                            placeholder={t('Поиск сотрудников') + '...'}
                            onChange={handleSearch}/>
                        <div className={classes.searchButton}>
                            <SearchIcon style={iconStyle}/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
})

TrackingAgentSearch.PropTypes = {
    filter: PropTypes.object
}

export default TrackingAgentSearch
