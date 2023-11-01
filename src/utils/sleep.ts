const sleep = (msTime: number) => {
  return new Promise(resolve => setTimeout(resolve, msTime))
}

export default sleep
