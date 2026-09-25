export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  RESIDENT: 'RESIDENT',
};

export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: 'HomeIcon' },
  { name: 'Buildings', path: '/buildings', icon: 'BuildingOffice2Icon' },
  { name: 'Units', path: '/units', icon: 'Square3Stack3DIcon' },
  { name: 'Devices', path: '/devices', icon: 'CpuChipIcon' },
  { name: 'Energy', path: '/energy', icon: 'BoltIcon' },
  { name: 'Maintenance', path: '/maintenance', icon: 'WrenchScrewdriverIcon' },
  { name: 'Users', path: '/users', icon: 'UsersIcon', adminOnly: true },
];
