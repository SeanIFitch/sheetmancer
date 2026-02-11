.PHONY: help install dev build preview typecheck clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start development server
	pnpm dev

build: ## Build for production
	pnpm build

preview: ## Preview production build
	pnpm preview

typecheck: ## Run TypeScript type checking
	pnpm typecheck

clean: ## Clean build artifacts
	rm -rf dist node_modules .pnpm-store
