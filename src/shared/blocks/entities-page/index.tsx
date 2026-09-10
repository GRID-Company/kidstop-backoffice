import CardContainer from './primitives/card-container';
import { Root } from './primitives/root';
import { Title } from './primitives/title';

interface Props {
  children: React.ReactNode;
  className?: string;
}
type ToolbarProps = Props & {
  label: string;
} & React.HTMLAttributes<HTMLDivElement>;

type EntitiesPageCompound = React.FC<Props> & {
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
  ...props
}: ToolbarProps) {
  return (
    <div
      className={`mb-6 flex w-full items-center justify-between gap-2 px-4 ${className}`}
      {...props}
    >
      {label && (
        <EntitiesPage.FlexRow>
          <EntitiesPage.Title label={label} />
        </EntitiesPage.FlexRow>
      )}
      {children}
    </div>
  );
};

export { EntitiesPage };
