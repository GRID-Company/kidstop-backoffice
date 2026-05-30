'use client';
import Users from '@/features/users/ui/views/users';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Usuarios ${TITLE_SUFFIX}`);

  return <Users />;
}
