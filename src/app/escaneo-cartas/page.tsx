'use client';

import { CardScannerView } from '@/features/card-scanner/ui/views/card-scanner';
import { useTitle } from 'react-use';

export default function ScannerPage() {
  useTitle('Escáner de Cartas TCG - Kidstop');
  return <CardScannerView />;
}
