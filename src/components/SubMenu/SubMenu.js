import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Home from 'material-ui/svg-icons/action/home'
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import * as ROUTES from '../../constants/routes'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            width: '100%',
            height: '60px',
            marginTop: '-25px',
            display: 'flex',
            alignItems: 'center'
        },
        item: {
            color: '#44637e',
            marginRight: '15px',
            '&:hover': {
                cursor: 'pointer'
            }
        },
        active: {
            extend: 'item',
            borderBottom: '1px solid #44637e',
        }
    })
)


const SubMenu = enhance((props) => {
    const {classes, id} = props

    const menuItems = [
        {
            id: 1,
            name: "Metrika",
            childs: [
                {id: 3, name: "Plan"},
                {id: 4, name: "Prodaji"},
                {id: 5, name: "Merchendayzing"}
            ]
        },
        {
            id: 2,
            name: "Prodaji",
            childs: [
                {id: 6, name: "Торговые точки", url: ROUTES.SHOP_LIST_URL},
                {id: 7, name: "История заказов", url: ROUTES.ORDER_HISTORY_LIST_URL}
            ]
        }
    ];

    const parent = _.chain(menuItems)
        .find((item) => { return (_.findIndex(item.childs, (ch) => ch.id == id) > -1)})
        .value();

    const items = _.map(parent.childs, (item, index) => {
        return (
            <span key={index} className={item.id == id ? classes.active : classes.item}> {item.name}</span>
        )
    });

    return (
        <div className={classes.wrapper}>
                    <Home style={{color: '#66696f'}}/>
                    <HardwareKeyboardArrowRight style={{color: '#66696f', height: '12px', marginRight:'5px'}}/>
                    {items}
        </div>
    )
})

SubMenu.propTypes = {
    id: PropTypes.number.isRequired,
}


export default SubMenu
