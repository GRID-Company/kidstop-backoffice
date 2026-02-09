import { Card, CardBody, CardHeader } from '@heroui/react';
import { Icon } from '@iconify/react';

interface SettingsSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  icon,
  children,
}: SettingsSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-3 px-6 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <Icon icon={icon} className="text-xl text-accent" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardBody className="px-6 pb-6">{children}</CardBody>
    </Card>
  );
}
