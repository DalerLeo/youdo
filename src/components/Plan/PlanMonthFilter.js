import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import IconButton from 'material-ui/IconButton'
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left'
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right'

const enhance = compose(
    injectSheet({
        padding: {
            padding: '20px 30px'
        },
        titleDate: {
            display: 'flex',
            alignItems: 'center',
            extend: 'padding',
            '& svg': {
                minWidth: '32px',
                width: '32px !important',
                height: '32px !important',
                marginRight: '10px'
            },
            '& a': {
                fontWeight: '600'
            }
        },
        datePicker: {
            background: '#fff',
            padding: '10px 0 20px',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2',
            '& > div': {
                textAlign: 'center'
            }
        }
    })
)

const navArrow = {
    icon: {

    }
}

const PlanMonthFilter = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.titleDate}>
            <nav>
                <IconButton>
                    <LeftArrow/>
                </IconButton>
            </nav>
        </div>
    )
})

export default PlanMonthFilter
