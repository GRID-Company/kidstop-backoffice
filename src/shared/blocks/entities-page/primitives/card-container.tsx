import { CardBody, CardProps } from '@heroui/react';
import { PropsWithChildren } from 'react';
import { Card } from '@heroui/react';

export default function CardContainer({
  children,
  ...cardProps
}: PropsWithChildren<Partial<CardProps>>) {
  return (
    <Card radius='md' shadow='md' {...cardProps}>
      <CardBody className='p-6'>{children}</CardBody>
    </Card>
  );
}
