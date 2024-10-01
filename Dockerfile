# Build stage
FROM rust:1.81-slim-bullseye as builder

WORKDIR /app

# Copy the source code
COPY . .

# Build the application
RUN cargo build --release


# Production stage
FROM debian:bullseye-slim

WORKDIR /usr/local/bin

COPY --from=builder /app/target/release/validator-service .

CMD ["./validator-service"]