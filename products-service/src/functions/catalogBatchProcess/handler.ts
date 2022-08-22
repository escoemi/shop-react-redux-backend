import {middyfy} from "@libs/lambda";
import { Product } from "src/entities/Product";
import { mapFromProductCSVDTOtoProduct } from "src/mappers/ProductMapper";
import { createMultipleProducts, publishProductsViaSNS } from "src/services/ProductService";

export const catalogBatchProcess = async (event) => {
    try {
        const productsDTO: Omit<Product, "id">[] = event.Records.map(item => mapFromProductCSVDTOtoProduct(item.body));
        
        await createMultipleProducts(productsDTO);
        
        await publishProductsViaSNS(productsDTO);
    
    } catch(error) {
        console.log('error: ', error);
    } 
};

export const main = middyfy(catalogBatchProcess);

