
<p align="center">
  <img src="https://raw.githubusercontent.com/Open-Payments/.github/refs/heads/main/profile/logo-white.png" />
</p>

# Messages API

The **Messages API** is part of the Open Payments initiative, designed to parse and validate financial payment messages. This API supports the FedNow ISO20022 format, applying validation rules from the official XSD schema files. The API is available for both public and private use, with a ready-to-deploy Docker image available on Docker Hub.

- **Repository**: [Open Payments Messages API](https://github.com/Open-Payments/messages-api)
- **Docker Hub**: [Payment Messages API Docker Image](https://hub.docker.com/r/harishankarn/payment-messages-api)
- **API Documentation**: [Postman Collection](https://www.postman.com/openpaymentsapi/open-payments/overview)

---

#### **API Endpoint:**

`POST /validate`

#### **Description:**

This endpoint accepts an XML payment message, identifies the message format (e.g., pacs.008, pacs.009), and performs the following actions:
1. **Parsing**: Converts the XML payment message into an internal object model.
2. **Validation**: Applies schema-based validation using the FedNow XSD files.
3. **Response**: Converts the parsed message into a JSON object and returns it as the API response.

---

#### **Request:**

- **Method**: `POST`
- **Content-Type**: `application/xml`
- **Body**: The XML content of the payment message (e.g., pacs.008, pacs.002, etc.).

##### Example Request:
```xml
<FIToFICstmrCdtTrf>
  <!-- Example XML content based on FedNow ISO20022 format -->
</FIToFICstmrCdtTrf>
```

---

#### **Response:**

- **Content-Type**: `application/json`
- **Body**: The parsed payment message in JSON format, with details of the validation status.

##### Example Successful Response:
```json
{
  "status": "success",
  "message": {
    "FIToFICstmrCdtTrf": {
      "GrpHdr": {
        "MsgId": "ABC123456",
        "CreDtTm": "2024-10-01T12:00:00Z"
      },
      ...
    }
  }
}
```

##### Example Validation Error Response:
```json
{
  "status": "error",
  "errors": [
    {
      "field": "GrpHdr.MsgId",
      "message": "Message ID is missing or invalid"
    }
  ]
}
```

---

#### **Running a Local Instance:**

To run your own private instance of the Validate API, you can use the Docker image from Docker Hub:

##### Step 1: Pull the Docker Image
```bash
docker pull harishankarn/payment-messages-api
```

##### Step 2: Run the Docker Container
```bash
docker run -p 8080:8080 harishankarn/payment-messages-api
```

This will start the API on port `8080` of your local machine. You can then make POST requests to `http://localhost:8080/validate`.

---

#### **Additional Features:**

- **Automatic Format Detection**: The API identifies the message type automatically, so no need to specify the format in the request.
- **XSD Validation**: Applies validation rules as defined by the FedNow XSD files.
- **JSON Conversion**: Converts valid XML messages to JSON format, making it easier to consume by modern applications.

---

### API Documentation and Try Out
Explore the full API documentation and **try out the Validate API** using the Postman Collection. Postman allows you to test the API directly in your browser:

- **Postman Collection**: [Open Payments Postman Collection](https://www.postman.com/openpaymentsapi/open-payments/overview)
- **Try it out**: You can use Postman’s “Run in Postman” button to directly test the API instance and see how it works with real data.

---
