# ZeroSSL NodeJS Bot

![logo](https://i.ibb.co/qgPtpFJ/zerossl-logo.png)

The ZeroSSL NodeJS Bot is a utility designed to manage SSL certificates for your applications. It interacts with the ZeroSSL API to create, verify, and download SSL certificates, ensuring your services are always secured with up-to-date certificates. The bot is designed to run in a Kubernetes environment, utilizing Kubernetes APIs to manage and restart services as needed.

## Features

- **Environment variable-based configuration for ease of use**

- **Checks and renews SSL certificates as needed**

- **Downloads, verifies, and hosts auth file**

- **Automatically switch main service with bot service to listen on port 80 and verify auth file**

- **Downloads certificate to SSL folder which is bind-mounted to a volume**

- **Restarts pods connected with the SSL data using Kubernetes API and retrieves main service**

## Installation

### Using Kubernetes

1. **Added zerossl-bot.yaml**
   You can download the `zerossl-bot.yaml` file from this repository.

2. **Setup environment variables:**
   fill remaning environment variables
   ```bash
   ZEROSSL_ACCESS_KEY=<API_KEY_FROM_ZEROSSL>
   DOMAIN=<YOUR_DOMAIN>
   EMAIL=<ZEROSSL_EMAIL>
   DEPLOYMENT_SELECTOR_ARR=<app=frontend,app=backend>
   MAIN_SERVICE_NAME=<FRONTEND_SERVICE_NAME>
3. **Add file to your configuration and run:**
   ```bash
   kubectl apply -f zerossl-bot.yaml
*   **Note:** Main service must run, even in the first time

### License
This project is licensed under the MIT License.

### Acknowledgments
Disclaimer: This app was developed as a personal project and is not affiliated with official ZeroSSl.

For any inquiries, please contact us at  itailavi0212@gmail.com.

© 2023 ZeroSSL Bot