#!/bin/bash

eval $(aws ecr get-login --no-include-email --region us-east-1)

docker build -t dap-service -f Dockerfile.deploy . &&
docker tag dap-service:latest 961839081442.dkr.ecr.us-east-1.amazonaws.com/dap-service:latest &&
docker push 961839081442.dkr.ecr.us-east-1.amazonaws.com/dap-service:latest
