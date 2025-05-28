import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import About from "../pages/About";  // popraw ścieżkę jeśli trzeba

describe("About component", () => {
    // sprawdzanie wyświetlania
  test("renders heading and paragraphs", () => {
    render(<About />);
    
    expect(screen.getByText(/O nas/i)).toBeInTheDocument();
    expect(screen.getByText(/Jesteśmy studentami/i)).toBeInTheDocument();
    expect(screen.getByText(/www.ekstrastats.pl/i)).toBeInTheDocument();
  });

  // sprawdzanie linku
  test("renders external link with correct href", () => {
    render(<About />);
    const link = screen.getByRole('link', { name: /www.ekstrastats.pl/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.ekstrastats.pl');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
