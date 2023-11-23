import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryBadge'
})
export class CategoryBadgePipe implements PipeTransform {

  transform(categoryName: string): string {
    let color: string;

    switch (categoryName) {
      case 'Légumes':
        color = 'green-700';
        break;
      case 'Fruits':
        color = 'red-500';
        break;
      case 'Pain':
        color = 'orange-600';
        break;
      case 'Produits Secs':
        color = 'cyan-500';
        break;
      case 'Conserve':
        color = 'yellow-600';
        break;
      default:
        color = 'gray-700';
    }

    return "bg-" + color;
  }

}
