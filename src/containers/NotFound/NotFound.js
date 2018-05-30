import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import NotFoundBg from '../../components/Images/page-not-found.png'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import t from '../../helpers/translate'

const enhance = compose(
  injectSheet({
    wrapper: {
      background: '#fdfdfd',
      width: '100%',
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
      background: 'url(' + NotFoundBg + ') no-repeat center center',
      backgroundSize: '200px',
      width: '200px',
      height: '200px',
      marginRight: '60px'
    },
    text: {
      color: '#666',
      '& h1': {
        fontSize: '60px',
        lineHeight: '1',
        fontWeight: '600',
        marginBottom: '40px',
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

const NotFound = enhance((props) => {
  const {classes} = props
  return (
    <div className={classes.wrapper}>
      <div className={classes.item}>
        <div className={classes.image}>
        </div>

        <div className={classes.text}>
          <h1>404 <span>{t('ошибка')}</span></h1>
          <p>{t('Запрашиваемая страница не найдена')}</p>
          <p>{t('Вернуться на')} <Link to={{
            pathname: ROUTES.DASHBOARD_URL}}>{t('главную')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
})

export default NotFound
