import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQLConfig } from './config/graphql.config';

@Module({
  imports: [ConfigModule.forRoot({
    ignoreEnvFile: !IS_DEV_ENV,
    isGlobal: true
  }), PrismaModule, GraphQLModule.forRootAsync({
    driver: ApolloDriver,
    useFactory: getGraphQLConfig
  })],
})
export class CoreModule {}
