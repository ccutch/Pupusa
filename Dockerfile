ARG GO_VERSION=1.22

FROM golang:${GO_VERSION}-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN go mod download && go mod verify
RUN go build -v -o /server-app ./server
# Build client


FROM alpine:latest
COPY --from=builder /server-app /app/
CMD ["/app/server-app", "serve", "--http=0.0.0.0:8080"]

