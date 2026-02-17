import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LitConnect brand', () => {
  render(<App />);
  expect(screen.getByText(/LitConnect/i)).toBeInTheDocument();
});