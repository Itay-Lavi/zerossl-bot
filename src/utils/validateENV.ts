import { accessKey, domain, email, deploymentSelectors, mainServiceName, botService } from '../config';

function validateENV() {
  const errors: string[] = [];
  if (!accessKey) errors.push('Access Key is missing!');
  if (!domain) errors.push('Domain is missing!');
  if (!email) errors.push('Email is missing');
  if (!deploymentSelectors || !deploymentSelectors.split(',').length) {
    errors.push('Invalid Deployment Selectors');
  }
  if (!mainServiceName) errors.push('Main Service Name is missing!');
  if (!botService) errors.push('Bot Service is missing!');

  if (errors.length > 0) {
    for (const error of errors) {
      console.log(error);
    }
    process.exit(4);
  }

}


export default validateENV;
