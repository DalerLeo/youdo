import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Home from 'material-ui/svg-icons/action/home'
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            width: '100%',
            height: '60px',
            marginTop: '-25px',
            display: 'flex'
        },
        addButton: {
            position: 'relative',
            transform: 'translate(0,20%)',
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        labelList: {
            color: '#44637e',
            position: 'relative',
            top: '20%',
            '&:hover': {
                borderBottom: '1px solid #44637e',
                cursor: 'pointer'
            }
        },
        valueList: {
            color: '#44637e',
            position: 'relative',
            top: '20%',
            '&:hover': {
                borderBottom: '1px solid #44637e',
                cursor: 'pointer'
            }
        },
        listWrapper: {
            display: 'flex',
            position: 'relative',
            top: '50%',
            transform: 'translate(0,-50%)',
            '& *': {
                marginRight: '15px'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            right: '0',
            marginBottom: '0px'
        },
        verticalCenter: {
            position: 'relative',
            top: '50%',
            transform: 'translate(0,-50%)'
        }
    })
)

const SubMenu = enhance((props) => {
    const {classes} = props

    return (
        <div className={classes.wrapper}>
            <div className={classes.listWrapper}>
                <div>
                    <Home className={classes.verticalCenter}/>
                    <HardwareKeyboardArrowRight className={classes.verticalCenter} />
                    <span className={classes.valueList}>Поставки</span>
                    <span className={classes.labelList}>Список поставщиков</span>
                </div>
            </div>

        </div>
    )
})

export default SubMenu
