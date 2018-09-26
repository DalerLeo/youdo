import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ChoosMenu from '../../components/Images/choose-menu.png'
import t from '../../helpers/translate'

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'fixed',
      left: '84px',
      right: '0',
      background: '#fdfdfd',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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

const WelcomeERP = enhance((props) => {
  const {classes} = props
  return (
    <div className={classes.wrapper}>
      <div className={classes.item}>
        <div className={classes.image}>
        </div>

        <div className={classes.text}>
          <h1>{t('Добро пожаловать')}!</h1>
          <p>{t('Для работы с системой выберите пункт меню')}</p>
        </div>
      </div>
    </div>
  )
})

export default WelcomeERP
