import {Stock} from './option.model';

export interface ActiveOfferDto {
    id: number;
    stock: StockDto;
    amount: number;
    pricePerStock: number;
    settlementDate: string;
    premium: number;
    status: OtcOfferStatus;
    canInteract: boolean;
    name: string;
}

export interface StockDto {
  name: string,
  ticker: string,
  price: number;
}

enum OtcOfferStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
  CANCELLED
}

/**
 * public class StockDto {
 *     private String name;
 *     private String ticker;
 *     private BigDecimal price;
 *     private BigDecimal change;
 *     private long volume;
 *     private long outstandingShares;
 *     private BigDecimal dividendYield;
 *     private BigDecimal marketCap;
 *     private BigDecimal maintenanceMargin;
 *     private String exchange;
 *     private BigDecimal ask;
 *
 * }
 */

/**
 *     private Long id;
 *     private StockDto stock;
 *
 *     private Integer amount;
 *     private BigDecimal pricePerStock;
 *     private BigDecimal premium;
 *     private LocalDate settlementDate;
 *
 *     private OtcOfferStatus status;
 *
 *     private Boolean canInteract; // true ako je lastModifiedById različit od userId pozivaoca
 *     private String name;
 */
