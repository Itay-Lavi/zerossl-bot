import { accessKey, deploymentSelectors, domain, email } from '../config';

function validateENV() {
  let errors: string[] = [];
  if (!accessKey) errors.push('Access Key is missing!');
  if (!domain) errors.push('Domain is missing!');
  if (!email) errors.push('Email is missing');
  if (!deploymentSelectors || !deploymentSelectors!.split(',').length) {
    errors.push('Invalid Deployment Selectors');
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.log(error);
    }
    process.exit(4);
  }
}

export default validateENV;
