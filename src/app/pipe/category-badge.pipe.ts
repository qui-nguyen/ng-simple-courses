import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryBadge'
})
export class CategoryBadgePipe implements PipeTransform {

  transform(categoryId: number): string {
    let color: string;

    switch (categoryId) {
      case 1:
        color = 'green-700';
        break;
      case 2:
        color = 'red-500';
        break;
      case 3:
        color = 'orange-600';
        break;
      case 4:
        color = 'cyan-500';
        break;
      case 5:
        color = 'yellow-600';
        break;
      default:
        color = 'gray-700';
    }

    return "bg-" + color;
  }

}
