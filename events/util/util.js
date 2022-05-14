module.exports = async (collected, type) => {  
  return collected.filter(e => e.listener == type)  
}