import { ChangeDetectorRef, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { DataService } from './data.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Helpers } from './helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { INotification } from './interfaces';
import { API } from '../api';
import { MatBottomSheet } from '@angular/material';
import { NotifyCardComponent } from './notify-card/notify-card.component';

const TITLE = 'InstiApp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  public openFlyout = false;
  public _title = TITLE;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dataService: DataService,
    public router: Router,
    public snackBar: MatSnackBar,
    private swUpdate: SwUpdate,
    private bottomSheet: MatBottomSheet,
    public activatedRoute: ActivatedRoute,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => {
      this.openFlyout = true;
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);

    /* If opened from notification */
    this.activatedRoute.queryParams.subscribe(params => {
      if ('from-notify' in params) {
        const from_notify = params['from-notify'];
        /* Mark as read if opened from notification */
        const sub = this.dataService.loggedInObservable.subscribe((status) => {
          this.dataService.FireGET(API.NotificationRead, { id: from_notify }).subscribe();
          sub.unsubscribe();
        });
      }
    });
  }

  private toggleSidebar() {
    this.openFlyout = !this.openFlyout;
  }

  ngOnInit() {
    /* Initialize stuff for title */
    this.dataService.titleObservable.subscribe((title) => {
      this._title = title;
    });

    /** Check for update */
    if (environment.production) {
      this.swUpdate.available.subscribe(event => {
        const snackBarRef = this.snackBar.open('New version available!', 'Refresh', {
          duration: 60000,
        });

        /* On clicking refresh */
        snackBarRef.onAction().subscribe(() => {
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        });
      });
      this.swUpdate.checkForUpdate();
    }

    /** Get user (try) */
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.dataService.setInitialized();
    }, (error) => {
      this.dataService.setInitialized();
    });

    /** Get notifications */
    this.dataService.loggedInObservable.subscribe(status => {
      if (status) {
        this.dataService.startNotificationsCheck();
      } else {
        this.dataService.stopNotificationsCheck();
      }
    });

    /* Setup notifications */
    this.setupNotifications();

    /* Initialize flyout to open on deskop */
    if (!this.mobileQuery.matches) {
      this.openFlyout = true;
    }

    /* Scroll to top on route change */
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
  }

  /** Unsubscribe from listeners */
  ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  /** Gets if the current router outlet state is `base` or `overlay` */
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  /** Close sidebar only for mobile */
  closeSidebarMobile() {
    if (this.mobileQuery.matches) { this.toggleSidebar(); }
  }

  /** Redirects to login */
  login() {
    if (!this.router.url.includes('login')) {
      const path = [this.router.url];
      localStorage.setItem(this.dataService.LOGIN_REDIR, this.dataService.EncodeObject(path));
    }
    window.location.href = this.dataService.GetLoginURL();
  }

  /** Handle reaching end of page and sidenav on android chrome */
  @HostListener('window:scroll')
  windowScroll() {
    Helpers.CheckScrollBottom(this.dataService.scrollBottomFunction);
  }

  /** Open notifications sheet */
  openNotifications() {
    this.bottomSheet.open(NotifyCardComponent);
  }

  /** Setup service worker notifications */
  setupNotifications() {
    /* Initialize service worker for notifications */
    if ('serviceWorker' in navigator ) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        /* Check if we have something */
        if (!registrations || registrations.length === 0) { return; }

        /* Get the first registration */
        const registration: ServiceWorkerRegistration = registrations[0];
        Notification.requestPermission().then((permission) => {
          if (permission !== 'denied') {
            this.dataService.swNotificationsReady = true;
            this.dataService.swRegistration = registration;
          }
        });
      });
    }
  }
}
