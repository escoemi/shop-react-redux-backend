export interface Product {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

export interface ProductDTO {
  id: string;
  title: string;
  description: string;
  price: string;
}

export interface StockDTO {
  id: string;
  product_id: string;
  count: number;
}

export interface ProductStockDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  product_id: string;
  count: number;
}
