import { NavigationIcon } from '../../shared/icons/navigation-icons';

export interface NavigationItemInterface {
  id: number;
  label: string;
  route: string;
  icon: NavigationIcon;
  tooltip?: string;
}
