# Workflow Tracker
# Host-driven dev loop, Postgres lives in docker.
#
# Daily flow:
#   make run        # bring up Postgres, run migrations, start the dev server
#
# First time only:
#   make setup      # create the venv, install deps, copy .env

PYTHON       := python3
PORT         := 8001
VENV         := backend/.venv
VENV_PYTHON  := $(VENV)/bin/python
VENV_PIP     := $(VENV)/bin/pip
VENV_RUFF    := $(VENV)/bin/ruff
VENV_PYTEST  := $(VENV)/bin/pytest
MANAGE       := $(VENV_PYTHON) backend/manage.py

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ----- daily one-shot dev loop ---------------------------------------------

run: $(VENV) backend/.env db-up migrate ## Bring up Postgres, run migrations, start the dev server
	$(MANAGE) runserver $(PORT)

# ----- first-time setup ----------------------------------------------------

setup: $(VENV) backend/.env ## Create venv, install deps, copy .env
	@echo "Setup complete. Run 'make run' to start the backend."

$(VENV):
	$(PYTHON) -m venv $(VENV)
	$(VENV_PIP) install --upgrade pip
	$(VENV_PIP) install -r backend/requirements.txt -r backend/requirements-dev.txt

backend/.env:
	cp backend/.env.example backend/.env
	@echo "Created backend/.env from .env.example"

# ----- backend commands (host) ---------------------------------------------

migrate: ## Apply Django migrations
	$(MANAGE) migrate

makemigrations: ## Create migrations from model changes
	$(MANAGE) makemigrations

shell: ## Open the Django shell
	$(MANAGE) shell

dbshell: ## Open a psql shell on the workflow database
	$(MANAGE) dbshell

superuser: ## Create a Django superuser
	$(MANAGE) createsuperuser

test: db-up ## Run pytest
	cd backend && ../$(VENV_PYTEST) -q

check: ## Run Django system checks
	$(MANAGE) check

seed: ## Seed sample applications (idempotent, add --force to wipe and reseed)
	$(MANAGE) seed_sample_applications

# ----- Postgres in docker --------------------------------------------------

db-up: ## Start Postgres in docker, waits until healthy
	docker compose up -d --wait db

db-down: ## Stop Postgres
	docker compose stop db

db-logs: ## Tail Postgres logs
	docker compose logs -f db

# ----- full stack in docker (alternative path) -----------------------------

up: ## docker compose up -d (Postgres + backend)
	docker compose up -d

down: ## docker compose down
	docker compose down

logs: ## Tail backend logs
	docker compose logs -f backend

# ----- code quality --------------------------------------------------------

fmt: ## Format the backend with ruff
	$(VENV_RUFF) format backend

lint: ## Lint the backend with ruff
	$(VENV_RUFF) check backend

# ----- frontend ------------------------------------------------------------

fe-dev: ## Start the Vite dev server
	cd frontend && npm run dev

fe-build: ## Build the frontend for production
	cd frontend && npm run build

fe-install: ## Install frontend dependencies
	cd frontend && npm install

# ----- aliases -------------------------------------------------------------

dev: run ## Alias for 'run'

mm: makemigrations ## Alias for 'makemigrations'

m: migrate ## Alias for 'migrate'

.PHONY: help run setup migrate makemigrations shell dbshell superuser test check seed db-up db-down db-logs up down logs fmt lint fe-dev fe-build dev mm m
