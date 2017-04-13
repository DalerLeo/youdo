import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Home from 'material-ui/svg-icons/action/home'
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import ToolTip from '../ToolTip'

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

const DeliveryList = enhance((props) => {
    const {classes, handleOpenFilterDialog} = props
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
            <div className={classes.addButtonWrapper}>
                <ToolTip position="left" text="Add marker">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={handleOpenFilterDialog}>
                        <ContentAdd />
                    </FloatingActionButton>
                </ToolTip>
            </div>
        </div>
    )
})
DeliveryList.propTypes = {
    handleOpenFilterDialog: React.PropTypes.bool.isRequired
}

export default DeliveryList
