import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import * as config from 'config'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  // context is based on NODE_ENV environment variable -> if undefined then dev
  const serverConfig = config.get('server')

  const port = process.env.PORT || serverConfig.port
  await app.listen(port)
  logger.log(`Application listening on port: ${port}`)
}
bootstrap()
