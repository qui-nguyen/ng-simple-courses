import { Component, effect } from '@angular/core';
import { Product } from '../type';
import { ProductService } from '../services/product.service';
import { ThemeService } from '../theme.service';


interface GroupedProducts {
  [categoryName: string]: Product[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  products: Product[];
  groupedProductsByCatName: GroupedProducts;
  transformedData: any;

  data: any;
  options: any;

  constructor(
    private productService: ProductService,
    private themeService: ThemeService) {
    effect(() => {
      this.canvas(this.themeService.getThemeState());
    })
  }

  private canvas(isDarkMode: boolean) {
    this.productService.getProducts().subscribe({
      next: (res => res ? this.products = res : this.products = []),
      complete: () => {
        const categoryCounts = this.countCategories(this.products);

        if (categoryCounts) {
          this.transformedData = this.transformData(categoryCounts, this.products.length);
        };

        if (this.transformedData) {
          const documentStyle = getComputedStyle(document.documentElement);
          const textColor = documentStyle.getPropertyValue(`${isDarkMode ? '--gray-50' : '--text-color'}`);
          const textColorSecondary = documentStyle.getPropertyValue(`${isDarkMode ? '--gray-50' : '--text-color'}`);

          this.data = {
            labels: this.transformedData.labels,
            datasets: [
              {
                label: 'Variété des catégories en stock',
                borderColor: documentStyle.getPropertyValue(`${isDarkMode ? '--green-100' : '--purple-400'}`),
                pointBackgroundColor: documentStyle.getPropertyValue(`${isDarkMode ? '--gray-50' : '--text-color'}`),
                // pointBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
                data: this.transformedData.datasetData,
              }
            ]
          };

          this.options = {
            plugins: {
              title: {
                display: true,
                text: 'Variété des catégories en stock',
                color: textColor,
                font:
                {
                  weight: 'bold',
                  size: 24,
                  textTransform: 'uppercase'
                }

              },
              legend: {
                labels: {
                  generateLabels: () => {
                    return this.transformedData.labels.map((label: any, i: number) => {
                      return {
                        text: `${label} : ${Math.round(this.transformedData.datasetData[i])} %`
                      };
                    }, this);
                  }
                }
              }
            },
            scales: {
              r: {
                grid: {
                  color: textColorSecondary
                },
                pointLabels: {
                  color: textColorSecondary
                }
              }
            },
            responsive: true
          }
        }
      }
    })
  }

  private countCategories(products: Product[]): { categoryName: string; count: number }[] {
    const countMap: Record<string, number> = {}; // defines that countMap is an object where the keys are strings (category names) and the values are numbers (counts).

    products.forEach((product) => {
      countMap[product.category?.name || 'Inconnue'] = (countMap[product.category?.name || 'Inconnue'] || 0) + 1;
    });

    return Object.entries(countMap).map(([categoryName, count]) => ({ categoryName, count }));
  }

  private transformData(countMap: { categoryName: string, count: number }[], total: number) {
    let labelsTmp: string[] = [];
    let datasetDataTmp: number[] = [];

    countMap.map(el => {
      labelsTmp.push(el.categoryName);
      datasetDataTmp.push((el.count * 100) / total);
    })

    return {
      labels: labelsTmp,
      datasetData: datasetDataTmp
    }
  }
}
