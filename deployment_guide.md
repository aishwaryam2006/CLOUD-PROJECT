# Virtual Queue System Deployment Guide

This guide provides step-by-step instructions to deploy the Virtual Queue Cafeteria Listing and Ordering System using Azure Cosmos DB for data storage and Azure Functions for the backend API.

## 1. Azure Cosmos DB Setup

Azure Cosmos DB will serve as the NoSQL database for our application. Follow these steps to set up your Cosmos DB account, database, and containers.

### 1.1 Create an Azure Cosmos DB Account

1.  Log in to the [Azure Portal](https://portal.azure.com/).
2.  Click `+ Create a resource`.
3.  Search for `Azure Cosmos DB` and select it.
4.  Click `Create`.
5.  Choose `Core (SQL) - Recommended` API and click `Create`.
6.  Fill in the following details:
    *   **Subscription:** Select your Azure subscription.
    *   **Resource Group:** Create a new one or select an existing one (e.g., `VirtualQueueRG`).
    *   **Account Name:** Enter a unique name (e.g., `virtualqueuecosmosdb`).
    *   **Location:** Choose a region close to your users.
    *   **Capacity mode:** Select `Provisioned throughput` or `Serverless` based on your needs. For development, `Serverless` is often cost-effective.
    *   **Apply Free Tier Discount:** If eligible, apply it.
7.  Click `Review + create`, then `Create`.

### 1.2 Create Database and Containers

Once your Cosmos DB account is deployed:

1.  Navigate to your newly created Cosmos DB account in the Azure Portal.
2.  In the left-hand menu, under `Data Explorer`, click `New Container`.
3.  Create the database and containers with the following specifications:

| Container Name | Database ID      | Partition Key | Throughput (RU/s) | Description                               |
| :------------- | :--------------- | :------------ | :---------------- | :---------------------------------------- |
| `users`        | `VirtualQueueDB` | `/id`         | Auto-scale        | Stores user profiles (students & vendors) |
| `cafeterias`   | `VirtualQueueDB` | `/id`         | Auto-scale        | Stores cafeteria details                  |
| `menuItems`    | `VirtualQueueDB` | `/cafeId`     | Auto-scale        | Stores menu items for each cafeteria      |
| `orders`       | `VirtualQueueDB` | `/cafeId`     | Auto-scale        | Stores all placed orders                  |
| `queues`       | `VirtualQueueDB` | `/cafeId`     | Auto-scale        | Manages token system for each cafeteria   |

    *Note: For `Throughput`, you can start with `Autoscale` or manually set a low RU/s (e.g., 400) and scale up as needed. Ensure the `Database ID` is consistent across all containers.* 

### 1.3 Insert Initial Data

After creating the containers, you need to insert initial data, especially for `queues` and `cafeterias` as specified in your project description.

1.  In the Azure Portal, navigate to your Cosmos DB account -> `Data Explorer`.
2.  Expand `VirtualQueueDB` and then the `queues` container.
3.  Click `New Item` and paste the following JSON, then click `Save`:

    ```json
    {
      "id": "queue_cafe1",
      "cafeId": "cafe1",
      "lastToken": 100,
      "currentServingToken": 100
    }
    ```

    *Note: The `id` should be unique. We use `queue_cafe1` to clearly link it to `cafe1`.*

4.  Expand `VirtualQueueDB` and then the `cafeterias` container.
5.  Click `New Item` and paste the following JSON, then click `Save`:

    ```json
    {
      "id": "cafe1",
      "name": "Main Canteen",
      "type": "Food",
      "open": true,
      "emoji": "🍱",
      "vendorId": null, // Assign a vendor ID later if applicable
      "description": "Main cafeteria — hot meals all day"
    }
    ```

    *You can add more cafeteria entries as needed, ensuring unique `id` values.*

## 2. Azure Functions Backend Deployment

This section guides you through deploying the Azure Functions that interact with your Cosmos DB.

### 2.1 Prepare the Azure Functions Project

1.  Ensure you have [Node.js](https://nodejs.org/en/download/) and the [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Ccsharp%2Cportal%2Cbash&pivots=programming-language-javascript#install-the-azure-functions-core-tools) installed locally.
2.  Navigate to the `api` directory in your project: `cd /home/ubuntu/virtual_queue_project/api`.
3.  Install dependencies: `npm install`.

### 2.2 Deploy to Azure Functions

1.  Log in to Azure from your local machine (or the sandbox environment if you have Azure CLI configured):
    `az login`
2.  Create a Function App in Azure:
    `az functionapp create --resource-group VirtualQueueRG --consumption-plan-location <your-region> --runtime node --runtime-version 18 --functions-version 4 --name <your-functionapp-name> --storage-account <your-storage-account-name>`
    *Replace `<your-region>`, `<your-functionapp-name>`, and `<your-storage-account-name>` with appropriate values. The storage account name must be globally unique.*
3.  Deploy your functions:
    `func azure functionapp publish <your-functionapp-name>`

### 2.3 Configure Application Settings

Your Azure Functions need to connect to Cosmos DB. You will add the Cosmos DB connection string as an application setting.

1.  In the Azure Portal, navigate to your Cosmos DB account.
2.  In the left-hand menu, under `Settings`, click `Keys`.
3.  Copy the `PRIMARY CONNECTION STRING`.
4.  Navigate to your Function App in the Azure Portal.
5.  In the left-hand menu, under `Settings`, click `Configuration`.
6.  Click `+ New application setting` and add the following:
    *   **Name:** `COSMOS_CONNECTION_STRING`
    *   **Value:** Paste the primary connection string you copied from Cosmos DB.
7.  Click `OK`, then `Save`.

## 3. Frontend Integration and Deployment

This section covers modifying your React frontend to interact with the deployed Azure Functions and then deploying the frontend.

### 3.1 Update Frontend API Calls

Currently, your frontend (`AppContext.js`) uses in-memory data. You need to modify it to call the Azure Functions endpoints.

1.  Open `/home/ubuntu/virtual_queue_project/VIRTUAL-QUEUE/src/context/AppContext.js`.
2.  Replace the in-memory data and functions with `fetch` calls to your Azure Functions endpoints. You will need to define a base URL for your API (e.g., `const API_BASE_URL = "https://<your-functionapp-name>.azurewebsites.net/api";`).

    *Example for `login` function:*

    ```javascript
    async function login(email, password) {
      try {
        const response = await fetch(`${API_BASE_URL}/AuthLogin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          return { error: data.error || 'Login failed' };
        }
        setCurrentUser(data.user);
        return { user: data.user };
      } catch (error) {
        return { error: 'Network error or API unavailable' };
      }
    }
    ```

    *Apply similar logic for `register`, `placeOrder`, `getMenus`, `getCafeterias`, `updateOrderStatus`, etc. Remember to handle `GET` requests by passing parameters in the URL query string if applicable.*

### 3.2 Deploy Frontend as Azure Static Web App

Azure Static Web Apps are ideal for hosting React applications.

1.  Ensure your frontend project is built:
    `cd /home/ubuntu/virtual_queue_project/VIRTUAL-QUEUE`
    `npm install`
    `npm run build` (This will create a `build` directory).
2.  Deploy your Static Web App. The easiest way is often through GitHub Actions, linking your repository to Azure. If deploying manually or from a local folder, you can use the Azure CLI:
    `az staticwebapp create --name <your-staticwebapp-name> --resource-group VirtualQueueRG --source "/home/ubuntu/virtual_queue_project/VIRTUAL-QUEUE/build" --output-location "/" --app-location "/" --api-location "/home/ubuntu/virtual_queue_project/api" --branch main --app-build-command "npm run build" --api-build-command "npm install" --no-wait`
    *Replace `<your-staticwebapp-name>` with a unique name.*

    *Note: When using Azure Static Web Apps, the API (Azure Functions) can be linked directly during creation or afterwards. The `--api-location` parameter points to your Azure Functions project directory.*

### 3.3 Configure Static Web App Settings

If your frontend needs to know the API base URL, you can configure it as an environment variable in the Static Web App.

1.  In the Azure Portal, navigate to your Static Web App.
2.  In the left-hand menu, under `Settings`, click `Configuration`.
3.  Add a new application setting (e.g., `REACT_APP_API_BASE_URL`) with the URL of your Azure Functions app.

## 4. Cross-Cafeteria Order Verification (Unique Feature)

To implement the "Cross-Cafeteria Order Verification" and "One-Time Claim Protection" features, you will need a dedicated Azure Function:

*   **`VerifyOrderClaim` (HTTP POST):**
    *   **Input:** `orderId` (or QR code data containing `orderId`)
    *   **Logic:**
        1.  Retrieve the order from the `orders` container using `orderId` and `cafeId` (if available from the QR code).
        2.  Check the `orderClaimed` status. If `true`, the order has already been claimed.
        3.  If `false`, update `orderClaimed` to `true` and return the order details.
        4.  This function should be secured to prevent unauthorized access.

## 5. Extra Features (3rd-Year Level)

### 5.1 Notification System

*   **Azure SignalR Service:** Integrate SignalR with your Azure Functions to push real-time notifications to the frontend (e.g., "Order ready", "Your turn is near").
*   **Frontend:** Subscribe to SignalR hubs to receive and display notifications.

### 5.2 Smart Wait Time Prediction & Analytics Dashboard

*   **Azure Functions:** Create functions to query and aggregate data from the `orders` container.
    *   `GetVendorAnalytics` (HTTP GET): For peak hours, most ordered items, average prep time.
*   **Cosmos DB:** Utilize Cosmos DB's analytical capabilities or integrate with Azure Synapse Analytics for complex queries and reporting.
*   **Frontend:** Develop UI components to display these analytics.

### 5.3 QR Code-Based Access

*   **Frontend:** When a user scans a QR code, it should contain a URL with the `cafeId` (e.g., `yourwebapp.com/cafeteria?id=cafe1`). The frontend can then parse this `cafeId` and navigate directly to the shop.

### 5.4 Order Expiry System

*   **Azure Function (Timer Trigger):** Create a timer-triggered Azure Function (`OrderExpiryCheck`) that runs periodically (e.g., every 5 minutes).
*   **Logic:** This function will query the `orders` container for orders that have passed a certain `expiryTime` (which you would add to the order document upon creation) and update their `status` to `expired`.

### 5.5 Multi-Queue System

*   The current `queues` container design already supports this by having a separate `lastToken` and `currentServingToken` per `cafeId`. If different types of items within a single cafeteria need separate queues (e.g., food vs. juice), you would need to adjust the `queues` container schema to include a `queueType` and modify the `PlaceOrder` and `AdvanceQueue` functions accordingly.

## References

*   [Azure Cosmos DB Documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/)
*   [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
*   [Azure Static Web Apps Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)
