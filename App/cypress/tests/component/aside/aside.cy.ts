import {AsideComponent} from '../../../../src/app/components/shared/aside/aside.component';
import {provideHttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../../../../src/app/services/auth.service';

class MockActivatedRoute {
  parent = {
    snapshot: {data: {title: 'myTitle '}},
    routeConfig: {
      children: {
        filter: () => {
        }
      }
    }
  };
}

// Mock AuthService
class MockAuthService {
  private authStatus = new BehaviorSubject<boolean>(true);
  authStatus$ = this.authStatus.asObservable();

  isAdmin() {
    return false;
  }

  isEmployee() {
    return true;
  }

  isClient() {
    return false;
  }

  getUserId() {
    return 1;
  }
}

it('mounts', () => {
  cy.mount(AsideComponent, {
    providers: [provideHttpClient(),
      {provide: ActivatedRoute, useClass: MockActivatedRoute},
      {provide: AuthService, useClass: MockAuthService},
    ],
    componentProperties: {},
  })
})

describe('AsideComponent isEmployee', () => {
  beforeEach(() => {
    cy.mount(AsideComponent, {
      providers: [provideHttpClient(),
        {provide: ActivatedRoute, useClass: MockActivatedRoute},
        {provide: AuthService, useClass: MockAuthService},
      ],
      componentProperties: {
        isAuthenticated: true,
        isEmployee: true,
        isClient: false,
        isAdmin: true,
        isModalOpen: false,
        isSidebarOpen: true,
        isAccountModalOpen: false,
        userId: 1,
      },
    })

  })

  it('should show employee-specific links', () => {
    cy.get('.sidebar-list').should('contain', 'New Account');
  });

  it('should show default', () => {
    cy.get('.sidebar-list').should('contain', 'Client Portal');
    cy.get('.sidebar-list').should('contain', 'Accounts');
    cy.get('.sidebar-list').should('contain', 'Payments');
    cy.get('.sidebar-list').should('contain', 'Loans');
    cy.get('.sidebar-list').should('contain', 'Currency Exchange');
  })
})
