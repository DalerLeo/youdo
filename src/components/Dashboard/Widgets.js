import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import WidgetIcon from 'material-ui/svg-icons/image/tune'
import Drawer from 'material-ui/Drawer'
import FlatButton from 'material-ui/FlatButton'
import {CheckBox} from '../ReduxForm'
import Loader from '../Loader'

export const WIDGETS_FORM_KEY = {
    SALES: 'sales',
    ORDERS: 'orders',
    AGENTS: 'agents',
    FINANCE: 'finance',
    CURRENCY: 'currency'
}

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 0'
        },
        widgetsWrapper: {
            '& header': {
                padding: '20px 30px',
                borderBottom: '1px #efefef solid',
                '& > h4': {
                    fontSize: '14px',
                    fontWeight: '600'
                }
            },
            '& form': {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            },
            '& footer': {
                padding: '12px 15px'
            }
        },
        switches: {
            padding: '20px 30px',
            height: '100%'
        },
        switch: {
            margin: '15px 0',
            '&:first-child': {
                marginTop: '0'
            },
            '&:last-child': {
                marginBottom: '0'
            },
            '& > div': {
                margin: '0 !important'
            }
        }
    }),
    reduxForm({
        form: 'DashboardWidgetsForm',
        enableReinitialize: true
    }),
    withState('openDrawer', 'setOpenDrawer', false),
)

const Widgets = enhance((props) => {
    const {
        classes,
        openDrawer,
        setOpenDrawer,
        submitForm,
        handleSubmit,
        list,
        loading
    } = props

    return (
        <div className={classes.filterWrapper}>
            <Drawer
                width={340}
                docked={false}
                openSecondary={true}
                containerClassName={classes.widgetsWrapper}
                onRequestChange={() => { setOpenDrawer(false) }}
                open={openDrawer}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <header>
                        <h4>Настройка виджетов</h4>
                    </header>
                    {loading
                        ? <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        : <div className={classes.switches}>
                            {_.map(list, (item) => {
                                const name = _.get(item, 'name')
                                const keyname = _.get(item, 'keyName')
                                return (
                                    <div key={keyname} className={classes.switch}>
                                        <Field
                                            label={name}
                                            name={keyname}
                                            component={CheckBox}/>
                                    </div>
                                )
                            })}
                        </div>}
                    <footer>
                        <FlatButton
                            label="Применить"
                            backgroundColor={'#12aaeb'}
                            hoverColor={'#12aaeb'}
                            rippleColor={'#fff'}
                            style={{height: '40px', lineHeight: '40px'}}
                            labelStyle={{color: '#fff', fontWeight: '600', verticalAlign: 'baseline'}}
                            fullWidth={true}
                            type="submit"/>
                    </footer>
                </form>
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
