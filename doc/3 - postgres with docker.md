# --- GInstall DOcker and Docker compose

# Start containers in detached / background mode
docker-compose up -d

# Stop containers
docker-compose down

# online PgAdmin for tuto
user@domain.com
SuperSecret

# Install TypeORM
npm install @nestjs/typeorm typeorm pg


#♥ local postgres pwd
P0st3Gr@is
5433

# Repository = to access DB
# => each entity has its own repository

# @JoinTable() --> only on the owner, here Coffee entity
# @ManyToMany() --> on both sides
# ex:
#       @ManyToMany(type => Flavor, (flavor) => Flavor.coffees)
#       @ManyToMany(type => Coffee, coffee => coffee.flavors)

# create pagination dto
nest g class common/dto/pagination-query.dto --no-spec

# create events
nest g class events/entities/event.entity --no-spec

# Migrations
# Creating a TypeOrm Migration
# npx allows to use package witot install it
npx typeorm migration:create -n CoffeeRefactor

# Compile project first 
npm run build

# Run migration(s) 
npx typeorm migration:run

# REVERT migration(s)
npx typeorm migration:revert

# Let TypeOrm generate migrations (for you)
# after added a column into entity
npx typeorm migration:generate -n SchemaSync

