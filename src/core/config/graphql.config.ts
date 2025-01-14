import { isDev } from '@/src/shared/utils/is-dev.util';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export function getGraphQLConfig (configSevice: ConfigService): ApolloDriverConfig {

    return {
        playground: isDev(configSevice),
        path: configSevice.getOrThrow<string>("GRAPHQL_PREFIX"),
        autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
        sortSchema: true,
        context: ({ req, res}) => ({ req, res }),
    }
}