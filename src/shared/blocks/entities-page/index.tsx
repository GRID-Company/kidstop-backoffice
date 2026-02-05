import CardContainer from './primitives/card-container';
import { Root } from './primitives/root';
import { Title } from './primitives/title';

interface Props {
  children: React.ReactNode;
  className?: string;
}
type ToolbarProps = Props & {
  label: string;
};

type EntitiesPageCompound = React.FC<any> & {
  Title: typeof Title;
  CardContainer: typeof CardContainer;
  Toolbar: React.FC<ToolbarProps>;
  FlexRow: React.FC<Props>;
};

const EntitiesPage = Object.assign(Root, {
  Title,
  CardContainer,
}) as EntitiesPageCompound;

EntitiesPage.FlexRow = function FlexRow({ children }: Props) {
  return <div className='flex items-center gap-4'>{children}</div>;
};

EntitiesPage.Toolbar = function Toolbar({
  label,
  className,
  children,
}: ToolbarProps) {
  return (
    <div
      className={`mb-6 flex items-center justify-between gap-2 px-4 ${className}`}
    >
      <EntitiesPage.FlexRow>
        <EntitiesPage.Title label={label} />
      </EntitiesPage.FlexRow>
      <EntitiesPage.FlexRow>{children}</EntitiesPage.FlexRow>
    </div>
  );
};

EntitiesPage.FlexRow = function FlexRow({ children }: Props) {
  return <div className='flex items-center gap-4'>{children}</div>;
};

export { EntitiesPage };
