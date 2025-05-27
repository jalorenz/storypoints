import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath:
                process.env.FRONTEND_DIRECTORY ?? `${__dirname}/../../frontend/out`,
        }),
    ],
})
export default class StaticFrontendModule {}