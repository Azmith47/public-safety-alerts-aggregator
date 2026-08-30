//Alert & Filter prop types

export type Alert = {
  id: number;
  external_id: string;
  title: string;
  description: string;
  category_id: number;
  source_id: number;
  location_id: number;
  status_type_id: number;
  severity_level_id: number;
  issued_at: string;
  updated_at: string;
  source_url: string | null;
  planned: boolean;
  is_major: boolean;
  impacting_network: boolean;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  delay: boolean;
  raw_payload: string;
  location_name: string;
  location_postcode: number;
  location_council_area: string;
  location_region: string;
};

export type AlertListProps = {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
};

export type AlertFilters = {
  source_id: number | null;
  is_active: boolean | null;
  location_council_area: string | null;
  location_region: string | null;
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

export type MarkerType = {
  alertId: number;
  alertType: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type PolygonType = {
  alertId: number;
  alertType: number;
  paths: {
    lat: number;
    lng: number;
  }[];
};

export type PolylineType = {
  alertId: number;
  alertType: number;
  paths: {
    lat: number;
    lng: number;
  }[];
};

export type BoundsType = {
  north: number;
  south: number;
  east: number;
  west: number;
};
