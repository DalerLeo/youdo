import React from 'react'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {reduxForm} from 'redux-form'
import WidgetIcon from 'material-ui/svg-icons/image/tune'
import Drawer from 'material-ui/Drawer'
import FlatButton from 'material-ui/FlatButton'

const enhance = compose(
    injectSheet({
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        filterWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
        },
        form: {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '300px',
            background: '#fff',
            zIndex: '50'
        },
        overlay: {
            background: 'rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '49',
            cursor: 'pointer'
        },
        filter: {
            display: 'flex',
            width: '100%',
            padding: '20px 30px',
            flexDirection: 'column',
            position: 'relative',
            '& h3': {
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '20px'
            }
        },
        closeFilter: {
            position: 'absolute !important',
            top: 10,
            right: 10
        },
        searchButton: {
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        excel: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        filterBtn: {
            extend: 'excel',
            background: '#12aaeb',
            position: 'relative'
        },
        count: {
            marginLeft: '5px'
        },
        date: {
            extend: 'excel',
            background: 'transparent',
            height: '100%',
            padding: '0 10px',
            justifyContent: 'center',
            position: 'absolute',
            left: '100%',
            color: '#12aaeb',
            whiteSpace: 'nowrap'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center'
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
    withState('openDrawer', 'setOpenDrawer', false),
)

const Widgets = enhance((props) => {
    const {
        classes,
        openDrawer,
        setOpenDrawer
    } = props

    return (
        <div className={classes.filterWrapper}>
            <Drawer
                width={300}
                docked={false}
                openSecondary={true}
                onRequestChange={() => { setOpenDrawer(false) }}
                open={openDrawer}>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                </ul>
            </Drawer>
            <FlatButton
                label="Виджеты"
                backgroundColor={'#12aaeb'}
                hoverColor={'#12aaeb'}
                rippleColor={'#fff'}
                icon={<WidgetIcon style={{width: 18, height: 18, fill: '#fff', verticalAlign: 'text-top'}}/>}
                style={{marginLeft: '10px'}}
                labelStyle={{color: '#fff', textTransform: 'none', fontWeight: '600', verticalAlign: 'baseline'}}
                onClick={() => { setOpenDrawer(true) }}/>
        </div>
    )
})

Widgets.propTypes = {}

export default Widgets
