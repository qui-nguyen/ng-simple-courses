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
        case 'Viandes et Poissons':
        color = 'green-500';
        break;
      case 'Sauces':
        color = 'red-300';
        break;
      case "Produits d'hygiène":
        color = 'orange-300';
        break;
      case 'Produits nettoyant':
        color = 'cyan-200';
        break;
      case 'Produits laitiers':
        color = 'yellow-400';
        break;
        case 'Surgelés':
        color = 'green-900';
        break;
      case 'Boissons':
        color = 'red-700';
        break;
      case 'Animalerie':
        color = 'orange-800';
        break;
      case 'Parapharmacie':
        color = 'cyan-700';
        break;
      case 'Bébé':
        color = 'purple-300';
        break;
        case 'Auto, moto':
        color = 'cyan-300';
        break;
      case 'Bricolage':
        color = 'yellow-200';
        break;
      default:
        color = 'gray-700';
    }

    return "bg-" + color;
  }

}
