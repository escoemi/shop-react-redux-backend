import { Product } from 'src/entities/Product';
import productList from '../db/ProductList.json';

export const getAllProducts=async():Promise<Product[]>=>{
  const allProducts:Product[]=productList;
  return allProducts;
}

export const getProductById=async(id:string):Promise<Product|undefined>=>{
  const allProducts=await getAllProducts();
  const product=allProducts.find((product)=>product.id==id);
  return product;
}