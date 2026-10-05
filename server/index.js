
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

    // SMTP login comes from index.conf (e.g. Zoho: smtppro.zoho.eu, your mailbox address and an app password)
    NE_EmailHelper.setupEmailSender("test", {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD || process.env.SMTP_APIKEY,
      senderEmailID: process.env.SMTP_FROM || process.env.SMTP_USER,
      senderName: process.env.SMTP_SENDER_NAME || "SherinV",
    })

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
