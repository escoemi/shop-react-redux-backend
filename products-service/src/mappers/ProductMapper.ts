import { Product, ProductStockDTO } from "src/entities/Product";

export const mapFromProductStockDTOtoProduct = (
  productDTO: ProductStockDTO
): Product => ({
  id: productDTO.product_id,
  title: productDTO.title,
  description: productDTO.description,
  price: productDTO.price,
  count: productDTO.count,
});


export const mapFromProductCSVDTOtoProduct=(productStringify:string)=>{
  const product=JSON.parse(productStringify)
  return {...product, count:+product["﻿count"], price:+product.price};
}