# --- Generate a Controller 'coffees'
nest generate controller coffees
# shorthand: $ nest g co coffees
# > automatically create test file ( nest g co --no-spec : to not generate this file), and added the reference in app.module

# generate controller in a sub folder (-)
nest g co modules/abc

# add -dry-run to test the command without actually creating any file
nest g co modules/abc --dry-run

# generate service (re-usable logic) (will create folder only if needed)
nest g s coffees

# Create a module dedicated to our 'coffee' logic
# Dont forget to remove import in app.modules when implementing a dedicated module !! 
nest g module coffees

# Create a DTO for creating coffee without spec (test)
nest g class coffees/dto/create-coffee.dto --no-spec

# Dto validator
# in main.ts add
app.useGlobalPipes(new ValidationPipe());

npm i class-validator class-transformer
npm i @nestjs/mapped-types

# using mapped-type pckg, to extends a DTO but with all parameters optionals + all validations rules
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto)
