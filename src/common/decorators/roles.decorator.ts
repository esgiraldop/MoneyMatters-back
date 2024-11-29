import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: number[]) => {
  console.log('\n\n\nroles: ', roles);
  return SetMetadata(ROLES_KEY, roles);
};
