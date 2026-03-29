# Your local dev flow from here:
#
# cd basechat
#
# # Generate secrets
# openssl rand -hex 32 # → BETTER_AUTH_SECRET
# openssl rand -hex 32 # → ENCRYPTION_KEY
#
# # Fill those + your RAGIE_API_KEY + ANTHROPIC_API_KEY into .env.local
# # then:
#
# make start # postgres up
# make db.migrate # run migrations
# make dev # app at localhost:3000
.PHONY: setup start stop db.migrate db.reset dev logs

setup:
	cp .env.example .env.local
	@echo ""
	@echo "Fill in .env.local with your keys:"
	@echo "  BETTER_AUTH_SECRET  ->  openssl rand -hex 32"
	@echo "  ENCRYPTION_KEY      ->  openssl rand -hex 32"
	@echo "  RAGIE_API_KEY       ->  from ragie.ai"
	@echo "  RAGIE_WEBHOOK_SECRET->  any random string for local dev"
	@echo "  ANTHROPIC_API_KEY   ->  from console.anthropic.com"
	@echo ""
	@echo "Then run: make start && make db.migrate && make dev"

start:
	docker compose up -d

stop:
	docker compose down

db.migrate:
	npm run db:migrate

db.reset:
	docker compose down -v
	docker compose up -d
	sleep 2
	npm run db:migrate

dev:
	npm run dev

logs:
	docker compose logs -f db
