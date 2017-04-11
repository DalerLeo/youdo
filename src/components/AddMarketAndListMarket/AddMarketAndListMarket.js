import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

const enhance = compose(
    injectSheet({

        wrapper: {
            position: 'relative',
            width: '100%',
            height: '50px',
        },
        addButton: {
            float: 'right',
            position: 'relative',
            top: '50%',
            transform: 'translate(0,-50%)',
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        labelAdd: {
            float: 'right',
            backgroundColor: '#464646',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '2px',
            marginRight: '5px',
            position: 'relative',
            top: '50%',
            transform: 'translate(0,-50%)'
        },
        verticalCenter: {
            position: 'relative',
            top: '50%',
            transform: 'translate(0,-50%)'
        }
    })
)

const AddMarketAndListMarket = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.wrapper}>
            <FloatingActionButton mini={true} className={classes.addButton}>
                <ContentAdd />
            </FloatingActionButton>
            <span className={classes.labelAdd}>Add market</span>
        </div>
    )
})
AddMarketAndListMarket.propTypes = {
}

export default AddMarketAndListMarket
