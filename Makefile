.PHONY: install dev build preview up down logs rebuild clean

## Local
install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

## Docker
up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f web

rebuild:
	docker compose build --no-cache web
	docker compose up -d

clean:
	docker compose down --rmi local
	rm -rf dist node_modules
