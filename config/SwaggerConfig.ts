import { ISwagger } from '../docs/Swagger.ts';

const swaggerConfig: ISwagger = {
  title: 'TodoList',
  version: '1.0.0',
  tags: [
    { name: 'User', description: 'Rotas relacionadas a usuários' },
    { name: 'Todo', description: 'Rotas relacionadas a tarefas' },
  ],
  contact: {
    name: 'Diego',
    email: 'diego.martins@agxsoftware.com',
    url: '',
  },
  openApiVersion: '3.0.0',
  customCssPath: '../docs/custom/swagger.css',
  customJsPath: '../docs/custom/swagger.js',
  routerPaths: [
    './routes/*.ts',  
    './features/user/*.ts',
    './features/todo/*.ts'
  ],
  generateJsonFile: false,
  swaggerOptions: {
    explorer: true,
  },
  routerDescription: 'Documentação das rotas da API',
};

export { swaggerConfig };
