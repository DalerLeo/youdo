import React from 'react'

const Container = (props) => {
  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}>{props.children}</div>
  )
}

export default Container
