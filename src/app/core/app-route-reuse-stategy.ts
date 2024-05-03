import {ActivatedRouteSnapshot, DetachedRouteHandle, BaseRouteReuseStrategy} from '@angular/router';
export class AppRouteReuseStrategy implements BaseRouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {

    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return null;
    }
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return false;//(future.routeConfig === curr.routeConfig) || future.data.reuseComponent;
    }
  }