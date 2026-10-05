
const {
  initializeGlobalErrorHandler,
  ApplicationError,
  NE_Environment,
  Implementation_Manager,
  NE_EmailHelper
} = require('sv-nex');
initializeGlobalErrorHandler();

const routes = require('./routedefinitions');
const defaultEmailTemplates = require('./emailTemplate');


const initServer = async () => {
  try {
    await NE_Environment.setEnvironment();
    await Implementation_Manager.initializeImplementation();

    NE_EmailHelper.setupEmailSender("test", { user: "apikey", senderEmailID: "admin@sherin.fun", pass: process.env.SMTP_APIKEY, senderName: "SherinV", host: process.env.SMTP_HOST, port: 587 })

    NE_EmailHelper.setDefaultTemplates(defaultEmailTemplates["defaultEmailTemplates"]);
    Implementation_Manager.initializeHttpAndStartServer(routes);

  } catch (err) {
    // Ensure all errors go through the structured error handler.
    throw err instanceof ApplicationError
      ? err
      : new ApplicationError({ message: err.message, errorObject: err });
  }
};


initServer();
