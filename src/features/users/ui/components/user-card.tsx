import { CardBody } from '@heroui/react';
import { User } from '@/lib/api/schema-types';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import UserRoleBadge from './user-role-badge';
import UserStatusBadge from './user-status-badge';
import { UserRole } from '../../domain/types';

interface UserCardProps {
  user: User;
  onPress?: (guid: string) => void;
}

export default function UserCard({ user, onPress }: UserCardProps) {
  return (
    <KidstopCard
      isPressable={!!onPress}
      onPress={() => onPress?.(user.guid)}
    >
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{user.name ?? 'Sin nombre'}</p>
          <UserStatusBadge activated={user.activated} />
        </div>

        <p className="text-content-tertiary text-sm">{user.emailAddress}</p>

        <div className="flex items-center justify-between">
          <UserRoleBadge role={user.role as UserRole} />
        </div>
      </CardBody>
    </KidstopCard>
  );
}
