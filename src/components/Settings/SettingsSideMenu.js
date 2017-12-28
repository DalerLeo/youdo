import React from 'react'
import _ from 'lodash'
import injectSheet from 'react-jss'
import {compose, withHandlers} from 'recompose'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getMenus} from '../SidebarMenu/MenuItems'
import {setLanguage, getLanguage} from '../../helpers/storage'
import {SHOP_LIST} from '../../constants/actionTypes'

const usersRefresh = () => {
    return {
        type: SHOP_LIST,
        payload: Promise.resolve({})
    }
}

const enhance = compose(
    injectSheet({
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '225px',
            maxWidth: '225px',
            position: 'relative'

        },
        wrapper: {
            padding: '30px 30px 20px',
            '& ul': {
                fontWeight: 'bold',
                marginBottom: '20px'
            },
            '& li': {
                paddingLeft: '20px',
                paddingTop: '10px',
                fontWeight: '400',
                '&:last-child': {
                    paddingBottom: '10px'
                }
            }
        },
        active: {
            color: '#12aaeb'
        },
        simple: {
            color: '#333'
        },
        language: {
            padding: '10px 30px 0px',
            '& > b': {
                padding: '10px 20px',
                '&:hover': {
                    textDecoration: 'underline',
                    cursor: 'pointer'
                }
            }
        }
    }),
    connect((state) => {
        const permissions = _.map(_.get(state, ['authConfirm', 'data', 'permissions']), (item) => {
            return _.get(item, 'codename')
        })
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        return {
            permissions,
            isAdmin
        }
    }),
    withHandlers({
        setLangAction: props => (lang) => {
            setLanguage(lang, true)
            return props.dispatch(usersRefresh())
        }})
)

const SettingsSideMenu = enhance((props) => {
    const {classes, currentUrl, permissions, isAdmin, setLangAction} = props
    const MenuItems = _.find(getMenus(permissions, isAdmin), {'section': 'Settings'})
    const sortedMenu = _.groupBy(MenuItems.childs, 'section')
    return (
        <div className={classes.leftPanel}>
            <div className={classes.language}>
                <b onClick={() => setLangAction('uz')}
                   className={getLanguage() === 'uz' ? classes.active : {}}>uz</b>
                <b onClick={() => setLangAction('ru')}
                   className={getLanguage() === 'ru' ? classes.active : {}}>ru</b>
                <b onClick={() => setLangAction('en')}
                   className={getLanguage() === 'en' ? classes.active : {}}>en</b>
            </div>
            <div className={classes.wrapper}>
                {_.map(sortedMenu, (item, index) => {
                    return (
                        <ul key={index}>
                            {index}
                            {_.map(item, (object, i) => {
                                return (
                                    <li key={i}>
                                        <Link to={object.url}>
                                            <span className={object.url === currentUrl ? classes.active : classes.simple}>
                                                {object.name}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    )
                })}
            </div>
        </div>
    )
})

SettingsSideMenu.propTypes = {
    currentUrl: PropTypes.string.isRequired
}

export default SettingsSideMenu
