import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Contact from "../pages/Contact";  // popraw ścieżkę jeśli trzeba

describe("Contact component", () => {
  test("renders heading and creator names", () => {
    render(<Contact />);
    
    expect(screen.getByText(/Kontakt/i)).toBeInTheDocument();
    expect(screen.getByText(/Miłosz Gronowski/i)).toBeInTheDocument();
    expect(screen.getByText(/Kamil Skałbania/i)).toBeInTheDocument();
  });

  // sprawdzanie wyświetlania i działania linków
  test("renders GitHub and email links", () => {
    render(<Contact />);
    
    const miloszGithub = screen.getByRole('link', { name: /Milosz180/i });
    expect(miloszGithub).toBeInTheDocument();
    expect(miloszGithub).toHaveAttribute('href', 'https://github.com/Milosz180');

    const kamilEmail = screen.getByRole('link', { name: 'kamil.skalbania2105@gmail.com' });
    expect(kamilEmail).toBeInTheDocument();
    expect(kamilEmail).toHaveAttribute('href', 'mailto:kamil.skalbania2105@gmail.com');
  });
});
