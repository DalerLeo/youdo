const MainStyles = {
  test: {
    padding: '10px'
  },
  dashedLink: {
    borderBottom: '1px dashed'
  },
  lightBlueBg: {
    background: '#f1f5f8',
    color: '#333'
  },
  // MODAL
  popUp: {
    color: '#333 !important',
    overflowY: 'unset !important',
    overflowX: 'unset !important',
    fontSize: '13px !important',
    position: 'relative',
    padding: '0 !important',
    height: '100%',
    maxHeight: 'none !important',
    marginBottom: '64px'
  },
  titleContent: {
    background: '#fff',
    color: '#333',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #efefef',
    padding: '0 10px 0 30px',
    height: '60px',
    zIndex: '999'
  },
  inContent: {
    display: 'flex',
    minHeight: '184px',
    overflow: 'unset',
    padding: '0 30px 20px',
    color: '#333'
  },
  bodyContent: {
    width: '100%'
  },
  form: {
    position: 'relative'
  },
  field: {
    width: '100%'
  },
  bottomButton: {
    bottom: '0',
    left: '0',
    right: '0',
    padding: '10px',
    zIndex: '999',
    borderTop: '1px solid #efefef',
    background: '#fff',
    textAlign: 'right',
    '& span': {
      fontSize: '13px !important',
      fontWeight: '600 !important',
      color: '#129fdd',
      verticalAlign: 'inherit !important'
    }
  },
  inputFieldCustom: {
    fontSize: '13px !important',
    height: '45px !important',
    marginTop: '7px',
    '& > div:first-child': {
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
  inputDateCustom: {
    fontSize: '13px !important',
    height: '45px !important',
    marginTop: '7px',
    '& > div:first-child': {
      fontSize: '13px !important'
    },
    '& label': {
      top: '20px !important',
      lineHeight: '5px !important'
    },
    '& input': {
      marginTop: '0 !important'
    },
    '& div:first-child': {
      height: '45px !important'
    }
  },
  actionButton: {
    fontSize: '13px !important',
    margin: '0 !important'
  }
}

export default MainStyles
