import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';
import '@testing-library/jest-dom';

// Simple unit test for Button component
describe('Button Component', () => {
  
  // Test 1: Renders correctly
  test('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  // Test 2: Handles clicks
  test('calls function when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    // Find button and click it
    const buttonElement = screen.getByText('Click me');
    fireEvent.click(buttonElement);
    
    // Check if function was called once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 3: Can be disabled
  test('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Can't click</Button>);
    const buttonElement = screen.getByText("Can't click");
    expect(buttonElement).toBeDisabled();
  });
});
