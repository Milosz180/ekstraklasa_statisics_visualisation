import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../pages/Register";

describe("Register component - proste testy", () => {
    // sprawdzanie uzupełniania inputów
    test("czy można wpisać tekst do inputów", () => {
        render(<Register />);
        const emailInput = screen.getByPlaceholderText("E-mail");
        const passInput = screen.getByPlaceholderText("Hasło");
        const repeatPassInput = screen.getByPlaceholderText("Powtórz hasło");

        fireEvent.change(emailInput, { target: { value: "test@test.com" } });
        fireEvent.change(passInput, { target: { value: "password" } });
        fireEvent.change(repeatPassInput, { target: { value: "password" } });

        expect(emailInput.value).toBe("test@test.com");
        expect(passInput.value).toBe("password");
        expect(repeatPassInput.value).toBe("password");
    });
});
