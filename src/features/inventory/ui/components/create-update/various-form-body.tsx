import { Control } from 'react-hook-form';
import { ProfileForm } from '../../../adapters/forms/profile.form.schema';

interface VariousFormProps {
  control: Control<ProfileForm>;
}

export default function VariousFormBody({ control }: VariousFormProps) {
  return <div>VariousForm</div>;
}
