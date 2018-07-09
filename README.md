# Data Pipeline Service

## Todo

- Dockerize
  - deploy

## Docker Installation

```
brew cask install docker
```

## Development

```
docker-compose -p dap -f docker-compose.yml -f docker-compose.dev.yml up
```

## Testing

```
docker-compose -p dap -f docker-compose.yml -f docker-compose.test.yml up
```
