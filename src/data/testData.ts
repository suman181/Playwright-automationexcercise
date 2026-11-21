/** Static, reusable test data and expected messages (single source of truth for specs). */
export const messages = {
  invalidLogin: 'Your email or password is incorrect!',
  emailExists: 'Email Address already exist!',
  accountCreated: 'Account Created!',
  accountDeleted: 'Account Deleted!',
  orderPlaced: 'Order Placed!',
  orderConfirmed: 'Congratulations! Your order has been confirmed!',
  allProducts: 'All Products',
  searchedProducts: 'Searched Products',
  emptyCart: 'Cart is empty!',
};

export const searchTerms = ['Tshirt', 'Jeans', 'Top'];
export const unknownSearchTerm = 'zzzxxqq-no-such-product';

export const paymentCard = {
  nameOnCard: 'QA Tester',
  number: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
};

export const orderComment = 'Please leave the parcel at the front desk. (automated test order)';
