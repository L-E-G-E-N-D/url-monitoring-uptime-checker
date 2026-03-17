const cron = require('node-cron')
const monitorService = require('./monitorService')

async function startScheduler() {
  console.log('Starting monitoring scheduler...')

  monitorService.runDueChecks()

  cron.schedule('* * * * *', () => {
    console.log('Scheduler: running checks...')
    monitorService.runDueChecks()
  })
}

module.exports = {
    startScheduler,
};
