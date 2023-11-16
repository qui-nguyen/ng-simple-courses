import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryBadge'
})
export class CategoryBadgePipe implements PipeTransform {

  transform(categoryId: number): string {
    let color: string;

    switch (categoryId) {
      case 1:
        color = 'green-800';
        break;
      case 2:
        color = 'red-500';
        break;
      case 3:
        color = 'green-400';
        break;
      case 4:
        color = 'blue-500';
        break;
      case 5:
        color = 'yellow-500';
        break;
      default:
        color = 'grey-500';
        break;
    }

    return `bg-${color}`;
  }

}
