
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../theme.service';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';


@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    items: MenuItem[] | undefined;
    checked: boolean = false;
    isDarkMode: boolean = false;

    constructor(
        private router: Router,
        private themeService: ThemeService,
        private authService: AuthService,
        private storageService: StorageService,
    ) { }

    ngOnInit() {
        this.items = [
            {
                label: 'Produits',
                icon: 'pi pi-fw pi-table',
                routerLink: '/product'
            },
            {
                label: 'Liste des courses',
                icon: 'pi pi-fw pi-shopping-cart',
                items: [
                    {
                        label: 'Liste de recettes',
                        icon: 'pi pi-fw pi-tags',
                        routerLink: '/shopping-list/recipe-list',
                    },
                    {
                        label: 'Liste des courses personnalisé',
                        icon: 'pi pi-fw pi-shopping-bag',
                        routerLink: '/shopping-list/customize-shop-list',
                    }

                ]
            },
            {
                label: 'Recettes',
                icon: 'pi pi-fw pi-file-edit',
                routerLink: '/recipes'
            },
            {
                label: 'Profil',
                icon: 'pi pi-fw pi-user',
                visible: this.storageService.isLoggedIn(),
                items: [
                    {
                        label: 'Paramètre',
                        icon: 'pi pi-fw pi-cog'
                    },
                    {
                        label: 'Déconnexion',
                        icon: 'pi pi-fw pi-times',
                        routerLink: '/login',
                        command: () => this.logout()
                    }

                ]
            }
        ];
    }

    goToHome() {
        this.router.navigate(['/']);
    }

    switchDarkMode(darkModeState: boolean): void {
        this.isDarkMode = !darkModeState;
        this.themeService.switchTheme(!darkModeState);
    }

    logout() {
        this.authService.logout();
        window.location.reload();
    }
}