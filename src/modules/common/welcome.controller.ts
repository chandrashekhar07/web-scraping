import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('')
export class WelcomeController {
    @Get()
    @HttpCode(HttpStatus.OK)
    public login(): string {
        const version = process.env.npm_package_version;
        return `Welcome to BlushRush. Build Version : ${version}`;
    }
}
