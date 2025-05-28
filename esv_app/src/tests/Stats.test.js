import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Stats from "../pages/Stats";  // ścieżka do komponentu
import '@testing-library/jest-dom';

const seasons = ["2021/22", "2022/23"];
const options = [
  { value: "team1", label: "Team 1" },
  { value: "team2", label: "Team 2" },
];
const statOptions = [
  { value: "goals", label: "Goals" },
  { value: "assists", label: "Assists" },
];
const teamsInfo = {
  team1: { logo: "logo1.png", color: "#ff0000" },
  team2: { logo: "logo2.png", color: "#00ff00" },
};
const statTranslations = {
  goals: "Bramki",
  assists: "Asysty",
};

const defaultProps = {
  seasons,
  options,
  statOptions,
  teamsInfo,
  statTranslations,
};

describe("Stats component", () => {
    // renderowanie przycisków do zmiany trybu
    test("renders mode buttons", () => {
        render(<Stats {...defaultProps} />);
        expect(screen.getByText("Statystyki H2H")).toBeInTheDocument();
        expect(screen.getByText("Sezon po sezonie")).toBeInTheDocument();
        expect(screen.getByText("Wykres zależności")).toBeInTheDocument();
        expect(screen.getByText("Dowolne wykresy")).toBeInTheDocument();
    });

    // zmiana trybu po kliknięciu
    test("switches mode on button click", () => {
        render(<Stats {...defaultProps} />);
        const seasonTrendBtn = screen.getByText("Sezon po sezonie");
        fireEvent.click(seasonTrendBtn);
        expect(screen.getByText("Statystyka:")).toBeInTheDocument();
    });

    // sprawdzenie działania
    test("renders without crashing and shows any text content", () => {
    const { container } = render(<Stats {...defaultProps} />);
    expect(container.textContent.length).toBeGreaterThan(0);
    });

    // sprawdzenie opcji h2h
    test("changes mode to 'Tabela H2H' on button click", () => {
    render(<Stats {...defaultProps} />);
    
    const btn = screen.getByText("Statystyki H2H");
    fireEvent.click(btn);

    expect(screen.getByText(/h2h/i)).toBeInTheDocument();
    });

    // sprawdzenie opcji sezon po sezonie
    test("changes mode to 'Sezon po sezonie' on button click", () => {
    render(<Stats {...defaultProps} />);
    
    const btn = screen.getByText("Sezon po sezonie");
    fireEvent.click(btn);

    expect(screen.getByText(/statystyka/i)).toBeInTheDocument();
    });

    // sprawdzenie opcji wykres zaleznosci
    test("changes mode to 'Wykres zależności' on button click", () => {
    render(<Stats {...defaultProps} />);
    
    const btn = screen.getByText("Wykres zależności");
    fireEvent.click(btn);

    expect(screen.getByText(/wykres zależności/i)).toBeInTheDocument();
    });

    // sprawdzenie opcji dowolny wykres
    test("changes mode to 'Dowolne wykresy' on button click", () => {
    render(<Stats {...defaultProps} />);
    
    const btn = screen.getByText("Dowolne wykresy");
    fireEvent.click(btn);

    expect(screen.getByText(/dowolne wykresy/i)).toBeInTheDocument();
    });


});
