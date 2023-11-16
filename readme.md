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
4. **Run job manually**
   ```bash
   kubectl create job --from=cronjob/zerossl-bot-cron ssl
5. **Generate dhparam.pem:**
   ```bash
   openssl dhparam -out dhparam.pem 2048
6. **Copy it to zerossl pod:**
   ```bash
   kubectl cp dhparam.pem <namespace>/<pod-name>:/root/ssl/dhparam.pem
7. **Wait 1 minute and follow the logs:**
   ```bash
   kubectl logs -f <pod-name>
### Issues

- **The range of valid ports is 30000-32767**

1. **Run this command**
   ```bash
   sudo nano /var/snap/microk8s/current/args/kube-apiserver
1. **Add or Edit --service-node-port-range line**
   ```bash
   --service-node-port-range=80-32767
2. **Restart**
    ```bash
   sudo microk8s.stop
   sudo microk8s.start
### License
This project is licensed under the MIT License.

### Acknowledgments
Disclaimer: This app was developed as a personal project and is not affiliated with official ZeroSSl.

For any inquiries, please contact us at  itailavi0212@gmail.com.

© 2023 ZeroSSL Bot