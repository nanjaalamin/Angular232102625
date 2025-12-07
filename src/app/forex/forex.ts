import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { formatCurrency } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [Header, Sidebar, Footer, HttpClientModule],
  templateUrl: './forex.html',
  styleUrl: './forex.css',
})
export class Forex implements AfterViewInit {
  private _table1: any;

  constructor(private renderer: Renderer2, private httpClient: HttpClient) { }

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-closed');
    this.renderer.addClass(document.body, "sidebar-collapsed");

    this._table1 = $("#table1").DataTable({
      "columnDefs": [
        {
          "targets": 3,
          "className": "text-right"
        }
      ]
    });

    this.bindTable1();
  }

  bindTable1(): void {
    console.log("bindTable1 started");

    // Using exchangerate-api.com (free tier, CORS enabled)
    // Base currency set to IDR
    const ratesUrl = "https://api.exchangerate-api.com/v4/latest/IDR";

    // Fetch the exchange rates
    this.httpClient.get(ratesUrl).subscribe(
      (data: any) => {
        console.log("Rates fetched:", data);
        
        const rates = data.rates;
        let index = 1;

        // Iterate over the rates and add the rows to the table
        for (const currency in rates) {
          // Currency name mapping (basic)
          const currencyNames: any = {
            'USD': 'US Dollar',
            'EUR': 'Euro',
            'GBP': 'British Pound',
            'JPY': 'Japanese Yen',
            'AUD': 'Australian Dollar',
            'CAD': 'Canadian Dollar',
            'CHF': 'Swiss Franc',
            'CNY': 'Chinese Yuan',
            'SEK': 'Swedish Krona',
            'NZD': 'New Zealand Dollar',
            'SGD': 'Singapore Dollar',
            'HKD': 'Hong Kong Dollar',
            'MYR': 'Malaysian Ringgit',
            'PHP': 'Philippine Peso',
            'THB': 'Thai Baht',
            'VND': 'Vietnamese Dong',
            'MXN': 'Mexican Peso',
            'BRL': 'Brazilian Real',
            'ZAR': 'South African Rand',
            'INR': 'Indian Rupee'
          };

          const currencyName = currencyNames[currency] || currency;
          const rate = rates[currency];
          const formatRate = formatCurrency(rate, "en-US", "", currency);

          console.log(`${currency}: ${currencyName} - ${formatRate}`);

          // Add the row with the index, symbol, currency name, and formatted rate
          const row = [index++, currency, currencyName, formatRate];
          this._table1.row.add(row);
        }
        this._table1.draw(false);
        console.log("Table drawn successfully with " + (index - 1) + " rows");
      },
      (error: any) => {
        console.error("Error fetching rates:", error);
        alert("Error fetching forex data. Check console for details.");
      }
    );
  }
}
