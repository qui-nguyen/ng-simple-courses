import { Inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class ThemeService {

    private currentTheme = signal<boolean>(false);

    constructor(@Inject(DOCUMENT) private document: Document) { }

    switchTheme(isDarkMode: boolean) {
        let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

        if (themeLink) {
            this.currentTheme.update(() => isDarkMode);
            themeLink.href = `${isDarkMode ? 'soho-dark' : 'soho-light'}.css`;
        }
    }

    getThemeState() {
        return this.currentTheme();
    }
}
