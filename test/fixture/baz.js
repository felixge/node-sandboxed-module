module.exports = {
  biz: function(){
    return 1 + 3;
  },
  bang: function() {
    return require('./foo') + someLocal + someGlobal + 3;
  }
};
