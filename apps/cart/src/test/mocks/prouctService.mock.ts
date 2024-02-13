export const ProductServiceMock = jest.fn().mockReturnValue({
  send: jest.fn().mockResolvedValue({
    name: 'Test',
    type: 'pizza',
    price: 13.99,
    weight: 250,
    description: 'Hey pizza',
    ingredients: ['ham', 'cheese'],
    image: 'http://example.com',
  }),
});
