import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryBadge'
})
export class CategoryBadgePipe implements PipeTransform {

  transform(categoryId: number): string {
    let color: string;

    switch (categoryId) {
      case 1:
        color = 'blue';
        break;
      case 2:
        color = 'green-100';
        break;
      case 3:
        color = 'yellow';
        break;
      case 4:
        color = 'red';
        break;
      case 5:
        color = '[#DBAD76]';
        break;
      default:
        color = 'grey-500';
    }

    return "bg-" + color;
  }

}
