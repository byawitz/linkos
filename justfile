default:
    just start

alias start :=start-dev
alias stop :=stop-dev
alias rm :=remove-dev
alias rmi :=remove-dev-image
alias build :=build-dev-image

start-dev:
    docker compose -f docker-compose.dev.yml up -d

stop-dev:
    docker compose -f docker-compose.dev.yml down

remove-dev:
    docker compose -f docker-compose.dev.yml down -v

remove-dev-image:
    docker rmi linkos/linkos

build-dev-image:
    docker build -t linkos/linkos .