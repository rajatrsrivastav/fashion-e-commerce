import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * 3 SIMPLE FRONTEND INTEGRATION TEST EXAMPLES
 */

describe('Frontend Integration Examples', () => {

  // Example 1: Frontend + Mocked API (Simulating data fetch)
  test('Example 1: Fetches and displays products from API', async () => {
    // 1. Mock the API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          { id: 1, name: 'Cool Shirt', price: 20 }
        ]),
      })
    ) as jest.Mock;

    // 2. Render the component that fetches data
    // Assuming ProductList handles fetching
    // render(<ProductList />);
    
    // For this example, we'll imagine a simple component code here:
    const SimpleProductList = () => {
      const [products, setProducts] = React.useState<any[]>([]);
      React.useEffect(() => {
        fetch('/api/products').then((res: any) => res.json()).then((data: any) => setProducts(data));
      }, []);
      if (products.length === 0) return <div>Loading...</div>;
      return <div>{products[0].name}</div>;
    };
    
    render(<SimpleProductList />);

    // 3. Verify loading state initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // 4. Wait for API data to display
    await waitFor(() => {
      expect(screen.getByText('Cool Shirt')).toBeInTheDocument();
    });
  });


  // Example 2: Component Interaction (Input + State Update)
  test('Example 2: User typing updates the display', () => {
    // This tests interaction between input field and display logic
    
    const GreetingComponent = () => {
      const [name, setName] = React.useState('');
      return (
        <div>
          <input 
            placeholder="Enter name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <p>Hello, {name ? name : 'Stranger'}!</p>
        </div>
      );
    };

    render(<GreetingComponent />);

    const input = screen.getByPlaceholderText('Enter name');
    
    // Check initial state
    expect(screen.getByText('Hello, Stranger!')).toBeInTheDocument();

    // Simulate interactions
    fireEvent.change(input, { target: { value: 'Alice' } });

    // Verify integration of state and UI
    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
  });


  // Example 3: Context + Component Integration
  test('Example 3: Context provider passes data to children', () => {
    // Validates that the theme system is working across components
    
    const ThemeContext = React.createContext('light');
    
    const ThemedButton = () => {
      const theme = React.useContext(ThemeContext);
      return <button className={theme}>I am {theme}</button>;
    };

    render(
      <ThemeContext.Provider value="dark">
        <ThemedButton />
      </ThemeContext.Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('dark');
    expect(button).toHaveTextContent('I am dark');
  });

});