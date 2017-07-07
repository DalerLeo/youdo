import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                margin: '0rem !important',
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        ul: {
            fontWeight: '600'
        },
        li: {
            paddingLeft: '20px',
            paddingTop: '18px',
            fontWeight: '500'
        }
    })
)

const StatSideMenu = enhance((props) => {
    const {classes} = props

    return (
        <div className={classes.wrapper}>
            <ul className={classes.ul}>
                Продажи
                <li className={classes.li}>
                    Агенты
                </li>
                <li className={classes.li}>
                    Магазины
                </li>
                <li className={classes.li}>
                    Товары
                </li>
            </ul>
        </div>
    )
})

StatSideMenu.propTypes = {

}

export default StatSideMenu
