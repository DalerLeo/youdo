const getStorage = (local) => {
  return local ? localStorage : sessionStorage
}

const getConfig = (text) => {
  return getStorage(false).getItem(text)
}

export default getConfig
