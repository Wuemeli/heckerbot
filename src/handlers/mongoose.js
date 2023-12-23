const {connect} = require('mongoose');
const { log } = require('../functions/functions/consolelog');

module.exports = async () => {
  log('Started connecting to MongoDB...', 'warn');

  await connect(process.env.MONGODB_URI).then(() => {
    log('MongoDB is connected to the atlas!', 'done');
  });
};
