import { Injectable, inject } from '@angular/core';
import { AuthService, User } from '@core/authentication';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { switchMap, tap } from 'rxjs';
import { Menu, MenuService } from './menu.service';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly permissonsService = inject(NgxPermissionsService);
  private readonly rolesService = inject(NgxRolesService);

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load() {
    this.setMenu(<Menu[]>this.authService.menu());

    return new Promise<void>((resolve, reject) => {
      this.authService
        .change()
        .pipe(
          tap(user => this.setPermissions(user))
          //hari since menu is not obtained by api call, lets not use subscription
          // switchMap(() => this.authService.menu()),
          // tap(menu => this.setMenu(<Menu[]>menu))
        )
        .subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
    });
  }

  private setMenu(menu: Menu[]) {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  private setPermissions(user: User) {
    // In a real app, you should get permissions and roles from the user information.
    /*const permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
    this.permissonsService.loadPermissions(permissions);
    this.rolesService.flushRoles();
    this.rolesService.addRoles({ ADMIN: permissions });
     // Tips: Alternatively you can add permissions with role at the same time.
    // this.rolesService.addRolesWithPermissions({ ADMIN: permissions });
    */
   console.log('user roles:', user.roles );
   console.log('user permissions:', user.permissions );
    this.rolesService.flushRolesAndPermissions();
    this.permissonsService.loadPermissions(user.permissions ?? []);

    user.roles?.forEach(role =>
      this.rolesService.addRoleWithPermissions(role.role, user.permissions ?? [])
    );
  }
}
