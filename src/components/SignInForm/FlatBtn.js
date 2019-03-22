import {renderReact}from 'hypernova-react'
import FlatButton from 'material-ui/FlatButton'

import React from 'react'

const FlatBtn = props => {

  return (
    <FlatButton
      type="submit"
      backgroundColor={'#5d6474'}
      hoverColor={'#5d6474'}
      rippleColor={'#fff'}
      label={'Войти'}
      labelStyle={{
        color: '#fff',
        verticalAlign: 'baseline'
      }}
      primary={true}
      fullWidth={true}
    />
  )
}

export default renderReact('FlatBtn', FlatBtn)
