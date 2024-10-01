# Open Payments Validator Service

This repository contains the **Validator-Service**, a Rust-based API for validating XML messages in the [Open Payments](https://github.com/Open-Payments/messages) format.

## Features

- Validate XML messages based on the Open Payments message library.
- Fast, reliable, and lightweight service built with Rust.
- Dockerized for easy deployment and scalability.

## How to Run the Validator Service

You can run the Validator Service either by using Docker or by building it from source.

### Running with Docker

To quickly get started, you can pull the pre-built Docker image from Docker Hub:

```bash
docker pull harishankarn/open-payments-validator-service