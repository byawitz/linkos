default:
    just start

alias start :=start-dev
alias stop :=stop-dev
alias rm :=remove-dev
alias rmi :=remove-dev-image
alias build :=build-dev-image

start-dev WHAT='dev':
    docker compose -f docker-compose.{{WHAT}}.yml up -d

stop-dev WHAT='dev':
    docker compose -f docker-compose.{{WHAT}}.yml down

remove-dev WHAT='dev':
    docker compose -f docker-compose.{{WHAT}}.yml down -v

remove-dev-image:
    docker rmi linkos/linkos

build-dev-image:
    docker build -t linkos/linkos .

shell WHAT='linkos':
     docker exec -it {{WHAT}} bash

logs:
    docker compose logs

test:
    just rm
    just start
    sleep 5
    cd e2e && bun test