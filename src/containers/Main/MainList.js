import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ChoosMenu from '../../components/Images/choose-menu.png'
import Layout from '../../components/Layout'

const enhance = compose(
    injectSheet({
        wrapper: {
            background: '#fdfdfd',
            height: 'calc(100% + 28px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 -28px -28px',
            userSelect: 'none'
        },
        item: {
            padding: '135px 100px',
            background: '#fff',
            border: '1px #efefef solid',
            display: 'flex',
            alignItems: 'center'
        },
        image: {
            background: 'url(' + ChoosMenu + ') no-repeat center center',
            width: '200px',
            height: '200px',
            marginRight: '60px'
        },
        text: {
            color: '#666',
            '& h1': {
                fontSize: '48px',
                lineHeight: '1',
                fontWeight: '600',
                marginBottom: '30px',
                '& span': {
                    display: 'block',
                    fontSize: '25px !important'
                }
            },
            '& p': {
                fontSize: '14px',
                margin: '5px 0',
                fontWeight: '600',
                '& a': {
                    fontWeight: '600'
                }
            }
        }
    })
)

const MainList = enhance((props) => {
    const {classes, layout} = props
    return (
        <Layout {...layout}>
            <div className={classes.wrapper}>
                <div className={classes.item}>
                    <div className={classes.image}>
                    </div>

                    <div className={classes.text}>
                        <h1>Добро пожаловать!</h1>
                        <p>Для работы с системой выберите пункт меню</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
})

export default MainList
