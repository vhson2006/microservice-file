import { NatsRecordBuilder } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import * as nats from 'nats';

export const natsRecord = (data: any) => {
  const headers = nats.headers();
  headers.set('traceId',  randomUUID());
        
  const natsRecord = new NatsRecordBuilder(data)
    .setHeaders(headers)
    .build();
  return natsRecord;

}