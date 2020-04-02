SHELL := /bin/bash

test:
	npm test

docker-test:
	docker run -t -i --rm --name node_sandboxed_module_tests -w /app -v $$(pwd):/app node:0.10-slim bash -c 'npm install && npm test'

.PHONY: test docker-test
