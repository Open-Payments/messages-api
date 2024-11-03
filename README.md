<p align="center">
  <img src="https://raw.githubusercontent.com/Open-Payments/.github/refs/heads/main/profile/logo-white.png" />
</p>

# Messages API

The **Messages API** is part of the Open Payments initiative, designed to parse and validate financial payment messages. This API supports both FedNow and ISO20022 message formats, applying validation rules from their respective schemas. The API is available for both public and private use, with a ready-to-deploy Docker image available on Docker Hub.

- **Repository**: [Open Payments Messages API](https://github.com/Open-Payments/messages-api)
- **Docker Hub**: [Payment Messages API Docker Image](https://hub.docker.com/r/harishankarn/payment-messages-api)
- **API Documentation**: [Postman Collection](https://www.postman.com/openpaymentsapi/open-payments/overview)

---

#### **API Endpoint:**

`POST /validate`

#### **Description:**

This endpoint accepts an XML payment message with a message type header and performs the following actions:
1. **Message Type Detection**: Uses the Message-Type header to determine the appropriate parser
2. **Parsing**: Converts the XML payment message into an internal object model
3. **Validation**: Applies schema-based validation for the specified message type
4. **Response**: Returns validation status and the parsed message as JSON if valid

---

#### **Request:**

- **Method**: `POST`
- **Headers**: 
  - `Content-Type`: `text/xml`
  - `Message-Type`: Either `fednow` or `iso20022`
- **Body**: The XML content of the payment message

##### Example Request:
```bash
curl -X POST http://localhost:8080/validate \
  -H "Content-Type: text/xml" \
  -H "Message-Type: iso20022" \
  -d '<Document>
        <CstmrCdtTrfInitn>
          <!-- ISO20022 XML content -->
        </CstmrCdtTrfInitn>
      </Document>'
```

---

#### **Response:**

- **Content-Type**: `application/json`
- **Status Codes**:
  - `200 OK`: Message is valid
  - `400 Bad Request`: Validation or parsing errors
- **Body**: Validation result with parsed data if successful

##### Example Successful Response:
```json
{
  "is_valid": true,
  "parsed_data": {
    "Document": {
      "CstmrCdtTrfInitn": {
        "GrpHdr": {
          "MsgId": "ABC123456",
          "CreDtTm": "2024-10-01T12:00:00Z"
        }
      }
    }
  },
  "errors": []
}
```

##### Example Validation Error Response:
```json
{
  "is_valid": false,
  "parsed_data": null,
  "errors": [
    "ISO20022 parsing error at path: Document.CstmrCdtTrfInitn.GrpHdr.MsgId",
    "Error details: required field `MsgId` missing"
  ]
}
```

---

#### **Running a Local Instance:**

To run your own private instance of the Messages API, you can use the Docker image from Docker Hub:

##### Step 1: Pull the Docker Image
```bash
docker pull harishankarn/payment-messages-api
```

##### Step 2: Run the Docker Container
```bash
docker run -p 8080:8080 harishankarn/payment-messages-api
```

This will start the API on port `8080` of your local machine.

---

#### **Features:**

- **Multiple Format Support**: Supports both FedNow and ISO20022 message formats
- **Detailed Error Reporting**: Provides specific error locations and messages for invalid content
- **JSON Conversion**: Automatically converts valid XML messages to JSON format
- **Thread Safety**: Handles parsing in separate threads to maintain responsiveness
- **Efficient Processing**: Optimized for handling large XML messages with minimal memory usage

---

#### **Supported Message Types:**

1. **FedNow Messages**:
   - All FedNow XML message formats
   - Validation against FedNow schema rules

2. **ISO20022 Messages**:
   - Customer Credit Transfer Initiation (pain.001)
   - Other ISO20022 message types to be added

---

### API Documentation and Testing

Explore the full API documentation and test the Messages API using the Postman Collection:

- **Postman Collection**: [Open Payments Postman Collection](https://www.postman.com/openpaymentsapi/open-payments/overview)
- **Sample Messages**: Example messages for both FedNow and ISO20022 formats are available in the repository's `samples` directory

---

### Development

To build and run the project locally:

1. **Requirements**:
   - Rust 1.75 or later
   - Cargo package manager

2. **Build**:
   ```bash
   cargo build
   ```

3. **Run**:
   ```bash
   cargo run
   ```

The server will start on `http://0.0.0.0:8080`

---