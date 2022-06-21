import { Body, Controller, Delete, Get, Ip, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiForbiddenResponse, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IP } from 'src/common/decorators/ip.decorator';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { LogC } from 'src/common/utils/logc';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Color } from 'src/common/enums/colors.enum';

// @UsePipes(ValidationPipe)// replace global declaration // can use new ... but its less performant // !! can be use for method too !!
@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {

    /**
     * Injecting coffees service
     */
    constructor(private readonly coffeesService: CoffeesService) {

    }

    /**
     * Pagination : using query parameters
     * =>  catch from 'http://localhost:3000/coffees?limit=20&offset=10'
     * @returns 
     */

    @Public()
    @Get()
    findAll(@Protocol('https') protocole, @Query() paginationQuery: PaginationQueryDto) {
        LogC.log({ protocole }, Color.FgWhite);
        return this.coffeesService.findAll(paginationQuery);
    }


    // @ApiResponse({ status: 403, description: 'Forbidden' })
    // @ApiForbiddenResponse( { description: 'Forbidden' })
    @Public()
    @Get(':id')
    // findOne(@Param('id') id: number) {// force the string to be converted into number !!!
    findOne(@Param('id', ParseIntPipe) id: number) { // force the string to be converted into number with PIPE (custom ParseInt here) !!!
        return this.coffeesService.findOne('' + id);
    }

    /**
     * Post method using Dto
     * @param CreateCoffeeDto 
     * @returns 
     */
    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        // console.log(createCoffeeDto instanceof CreateCoffeeDto);
        return this.coffeesService.create(createCoffeeDto);
    }

    /**
    * Patch method using Dto
    * @param UpdateCoffeeDto 
    * @returns 
    */
    @Patch(':id')
    update(@Param('id') id: string, @IP() Ip, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        // logc.debug(Ip);
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    // --> !!! @Body(ValidationPipe) allows to apply ValidationPipe only for this specific parameter !!!
    // @Patch(':id')
    // update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
    //     return this.coffeesService.update(id, updateCoffeeDto);
    // }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}

