import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Login from "../pages/Login";
import { AuthProvider } from "../AuthContext";

describe("Login component", () => {
    // renderowanie formularza
  test("renders Login form", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Hasło/i)).toBeInTheDocument();
    expect(screen.getByText(/Zaloguj/i)).toBeInTheDocument();
  });

  // pojawienie sie komunikatu bledu
  test("shows error message when fetch fails", async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/E-mail/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Hasło/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/Zaloguj/i));

    await waitFor(() =>
      expect(screen.getByText(/Błąd połączenia z serwerem./i)).toBeInTheDocument()
    );
  });
});
