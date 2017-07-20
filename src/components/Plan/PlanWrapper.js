import React from 'react'
import {hashHistory} from 'react-router'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import {reduxForm} from 'redux-form'
import TextFieldSearch from 'material-ui/TextField'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose, withState, withHandlers} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        search: {
            position: 'relative',
            display: 'flex',
            width: '100%',
            '& > div': {
                paddingRight: '35px'
            }
        },
        searchField: {
            fontSize: '13px !important',
            width: '100%',
            marginLeft: '50px'
        },
        searchButton: {
            position: 'absolute !important',
            right: '-10px'
        }
    }),
    reduxForm({
        form: 'PlanCreateForm',
        enableReinitialize: true
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

const PlanWrapper = enhance((props) => {
    const {
        classes,
        addPlan,
        search,
        setSearch,
        onSubmit
    } = props

    const zoneInfoToggle = (
        <div className={classes.searchField}>
            <form onSubmit={onSubmit}>
                <div className={classes.search}>
                    <TextFieldSearch
                        fullWidth={true}
                        hintText="Поиск"
                        className={classes.searchField}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <IconButton
                        iconStyle={{color: '#ccc'}}
                        className={classes.searchButton}
                        disableTouchRipple={true}>
                        <SearchIcon />
                    </IconButton>
                </div>
            </form>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.ZONES_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить зону">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={addPlan.handleOpenAddPlan}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <div className={classes.zonesWrapper}>
                {zoneInfoToggle}
            </div>
        </Container>
    )
})

PlanWrapper.PropTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    addPlan: PropTypes.shape({
        openAddPlan: PropTypes.bool.isRequired,
        handleOpenAddPlan: PropTypes.func.isRequired,
        handleCloseAddPlan: PropTypes.func.isRequired,
        handleSubmitAddPlan: PropTypes.func.isRequired
    }).isRequired
}

export default PlanWrapper
