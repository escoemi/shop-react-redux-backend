export class NotFoundProduct extends Error {
  message: string;
  status: number;
  constructor(productId: string) {
    super();
    this.message = `It was not possible to retrive the product with the id ${productId}`;
    this.status = 404;
  }
}

export class UserInputError extends Error {
  message: string;
  status: number;
  constructor(...fieldsMissing: string[]) {
    super();
    this.message = `The following fields doesn't meet the requirements `;
    fieldsMissing.forEach((field) => (this.message += " " + field));
    this.status = 400;
  }
}
