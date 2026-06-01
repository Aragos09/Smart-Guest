import React from 'react';
import { render, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { CartProvider, useCart } from '../cart-context';
import { describe, it, expect } from 'vitest';

function TestComponent() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-price">{totalPrice}</span>
      <div data-testid="cart-items">
        {cart.map((item) => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            {item.name} - Qty: {item.quantity} - Price: {item.price}
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          addToCart({
            id: 'item-1',
            name: 'Pumpkin Soup',
            price: 8.5,
            quantity: 1,
          })
        }
      >
        Add Soup
      </button>
      <button onClick={() => updateQuantity('item-1', 3)}>Update Soup Qty to 3</button>
      <button onClick={() => removeFromCart('item-1')}>Remove Soup</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

describe('CartContext', () => {
  it('should initialize with empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  it('should add item and update totals', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Soup').click();
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('8.5');
    expect(screen.getByTestId('item-item-1')).toHaveTextContent('Pumpkin Soup - Qty: 1 - Price: 8.5');
  });

  it('should increment quantity if same item added twice', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Soup').click();
    });
    act(() => {
      screen.getByText('Add Soup').click();
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('17');
  });

  it('should update quantity manually', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Soup').click();
    });
    act(() => {
      screen.getByText('Update Soup Qty to 3').click();
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('3');
    expect(screen.getByTestId('total-price')).toHaveTextContent('25.5');
  });

  it('should remove item', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Soup').click();
    });
    act(() => {
      screen.getByText('Remove Soup').click();
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.queryByTestId('item-item-1')).toBeNull();
  });

  it('should clear cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Soup').click();
    });
    act(() => {
      screen.getByText('Clear Cart').click();
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });
});
