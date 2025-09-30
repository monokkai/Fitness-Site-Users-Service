import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: process.env.DATABASE_HOST || 'auth-db',
                port: parseInt(process.env.DATABASE_PORT || '3306'),
                username: process.env.DATABASE_USER || 'root',
                password: process.env.DATABASE_PASSWORD || 'root',
                database: process.env.DATABASE_NAME || 'authdb', 
                entities: [User],
                synchronize: process.env.NODE_ENV === 'development',
            });
            return dataSource.initialize();
        }
    },
];
