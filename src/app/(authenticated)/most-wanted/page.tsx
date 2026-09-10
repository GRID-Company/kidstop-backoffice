'use client';

import { useTitle } from 'react-use';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import MostWantedConfig from '@/features/most-wanted/ui/views/most-wanted-config';

export default function Page() {
  useTitle(`Most Wanted ${TITLE_SUFFIX}`);

  return <MostWantedConfig />;
}
