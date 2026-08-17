export type Alert = {
  id: number;
  title: string;
  type: string;
  category: string;
  alertLocation: { region: string; suburb: string };
  datePublished: string;
  active: boolean;
};

export type AlertListProps = {
  onAlertClick: (alert: Alert) => void;
};

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

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
