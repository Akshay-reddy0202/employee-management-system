import { Component, inject, input } from '@angular/core';
import { NavigationItemInterface } from '../../../../core/models/navigation-item.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVIGATION_ICONS } from '../../../icons/navigation-icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-navigation-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-item.html',
  styleUrl: './navigation-item.css',
})
export class NavigationItem {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly icons = NAVIGATION_ICONS;
  readonly item = input.required<NavigationItemInterface>();
  readonly expanded = input.required<boolean>();

  protected get iconSvg(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.icons[this.item().icon]);
  }
}
