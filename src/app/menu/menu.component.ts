
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../theme.service';


@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
    items: MenuItem[] | undefined;
    checked: boolean = false;
    isDarkMode: boolean = false;

    constructor(
        private router: Router,
        private themeService: ThemeService
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
                routerLink: '/shopping-list'
            },
            {
                label: 'Recettes',
                icon: 'pi pi-fw pi-file-edit',
                routerLink: '/recipes'
            },
            {
                label: 'Profil',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Paramètre',
                        icon: 'pi pi-fw pi-cog'
                    },
                    {
                        label: 'Déconnexion',
                        icon: 'pi pi-fw pi-times'
                    }

                ]
            }
        ];
    }

    goToHome() {
        this.router.navigate(['/']);
    }

    switchDarkMode($event: any): void {
        this.isDarkMode = ($event.target as HTMLInputElement).checked;
        const theme = this.isDarkMode ? 'soho-dark' : 'soho-light';
        this.themeService.switchTheme(theme);
    }
}