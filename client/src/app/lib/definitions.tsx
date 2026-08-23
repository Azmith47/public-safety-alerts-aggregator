//Alert & Filter prop types

export type Alert = {
  id: number;
  title: string;
  type: number;
  category_id: number;
  category: string;
  alertLocation: { region: string; suburb: string };
  issued_at: string;
  is_active: boolean;
};

export type AlertListProps = {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
};

export type AlertFilters = {
  type: number | null;
  is_active: boolean | null;
};

export type FilterKey = keyof AlertFilters;

//Modal prop types

export type FilterModalProps = {
  initialFilters: AlertFilters;
  onApply: (filters: AlertFilters) => void;
  isOpen: boolean;
  onClose: () => void;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

//General component prop types

export type MenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onFilterClick: () => void;
  onMySearchesClick: () => void;
  onMyAlertsClick: () => void;
};

export type NavbarProps = {
  onMenuClick: () => void;
  onSubscribeClick: () => void;
};

export type IconButtonProps = {
  onClick: () => void;
  icon: string;
  alt: string;
};

export type PageOverlayProps = {
  menuOpen: boolean;
  modalOpen: string | null;
  onClick: () => void;
};
