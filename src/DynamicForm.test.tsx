import type { Parameter, ParameterModel } from "./DynamicForm"

import { fireEvent, render, screen } from "@testing-library/react"
import React from "react"
import { describe, expect, it } from "vitest"

import { DynamicForm } from "./DynamicForm"

describe("DynamicForm", () => {
  const mockParams: Parameter[] = [
    { id: 1, name: "Имя", type: "string" },
    { id: 2, name: "Фамилия", type: "string" },
    { id: 3, name: "Город", type: "number" },
  ]

  const mockModel: ParameterModel = {
    colors: ["red", "green", "blue"],
    paramValues: [{ paramId: 1, value: "Иван" }],
  }

  describe("A) Rendering fields from params", () => {
    it("should render all param fields with labels and inputs", () => {
      const handleChange = () => {}
      render(<DynamicForm model={mockModel} onChange={handleChange} params={mockParams} />)

      expect(screen.getByText("Имя")).toBeInTheDocument()
      expect(screen.getByText("Фамилия")).toBeInTheDocument()
      expect(screen.getByTestId("param-input-1")).toBeInTheDocument()
      expect(screen.getByTestId("param-input-2")).toBeInTheDocument()

      expect(screen.queryByText("Город")).not.toBeInTheDocument()
      expect(screen.queryByTestId("param-input-3")).not.toBeInTheDocument()
    })
  })

  describe("B) Initialization from model.paramValues", () => {
    it("should initialize input with value from model.paramValues", () => {
      const handleChange = () => {}
      render(<DynamicForm model={mockModel} onChange={handleChange} params={mockParams} />)

      const nameInput: HTMLInputElement = screen.getByTestId("param-input-1")
      expect(nameInput.value).toBe("Иван")
    })

    it("should initialize input with empty string when not in model.paramValues", () => {
      const handleChange = () => {}
      render(<DynamicForm model={mockModel} onChange={handleChange} params={mockParams} />)

      const lastNameInput: HTMLInputElement = screen.getByTestId("param-input-2")

      expect(lastNameInput.value).toBe("")
    })
  })

  describe("C) onChange callback is called with updated model", () => {
    it("should call onChange with updated model when input changes", () => {
      let capturedModel: ParameterModel | undefined
      const handleChange = (model: ParameterModel) => {
        capturedModel = model
      }

      render(<DynamicForm model={mockModel} onChange={handleChange} params={mockParams} />)

      const lastNameInput = screen.getByTestId("param-input-2")

      fireEvent.change(lastNameInput, { target: { value: "Иванов" } })

      expect(capturedModel?.colors).toEqual(["red", "green", "blue"])
      expect(capturedModel?.paramValues).toHaveLength(2)
      expect(capturedModel?.paramValues).toContainEqual({
        paramId: 2,
        value: "Иванов",
      })
    })

    it("should include all paramIds even if values are empty", () => {
      const emptyModel: ParameterModel = {
        colors: ["orange"],
        paramValues: [],
      }

      let capturedModel: ParameterModel | undefined
      const handleChange = (model: ParameterModel) => {
        capturedModel = model
      }

      render(<DynamicForm model={emptyModel} onChange={handleChange} params={mockParams} />)

      const nameInput = screen.getByTestId("param-input-1")
      fireEvent.change(nameInput, { target: { value: "Test" } })

      expect(capturedModel?.paramValues).toHaveLength(2)
      expect(capturedModel?.paramValues.find((pv) => pv.paramId === 1)).toBeDefined()
      expect(capturedModel?.paramValues.find((pv) => pv.paramId === 2)).toBeDefined()
    })
  })

  describe("D) getModel() method still works (backward compatibility)", () => {
    it("should return updated model via getModel() method", () => {
      const ref = React.createRef<DynamicForm>()
      const handleChange = () => {}
      render(<DynamicForm model={mockModel} onChange={handleChange} params={mockParams} ref={ref} />)

      const emailInput = screen.getByTestId("param-input-2")
      fireEvent.change(emailInput, { target: { value: "Иванов" } })

      const resultModel = ref.current?.getModel()

      expect(resultModel?.colors).toEqual(["red", "green", "blue"])
      expect(resultModel?.paramValues).toContainEqual({
        paramId: 2,
        value: "Иванов",
      })
    })
  })

  describe("E) Type filtering - only render string type parameters", () => {
    it("should render only parameters with type === 'string'", () => {
      const mixedTypeParams: Parameter[] = [
        { id: 1, name: "Имя", type: "string" },
        { id: 2, name: "Возраст", type: "number" },
        { id: 3, name: "Город", type: "string" },
        { id: 4, name: "Дата", type: "date" },
      ]

      const handleChange = () => {}
      render(<DynamicForm model={mockModel} onChange={handleChange} params={mixedTypeParams} />)

      expect(screen.getByText("Имя")).toBeInTheDocument()
      expect(screen.getByText("Город")).toBeInTheDocument()
      expect(screen.getByTestId("param-input-1")).toBeInTheDocument()
      expect(screen.getByTestId("param-input-3")).toBeInTheDocument()

      expect(screen.queryByText("Возраст")).not.toBeInTheDocument()
      expect(screen.queryByText("Дата")).not.toBeInTheDocument()
      expect(screen.queryByTestId("param-input-2")).not.toBeInTheDocument()
      expect(screen.queryByTestId("param-input-4")).not.toBeInTheDocument()
    })

    it("should not render anything if no string type parameters", () => {
      const nonStringParams: Parameter[] = [
        { id: 1, name: "Возраст", type: "number" },
        { id: 2, name: "Дата", type: "date" },
      ]

      const handleChange = () => {}
      const { container } = render(<DynamicForm model={mockModel} onChange={handleChange} params={nonStringParams} />)

      expect(container.querySelector("form")?.children.length).toBe(0)
    })
  })

  describe("F) Empty params array", () => {
    it("should render empty form when params array is empty", () => {
      const emptyParams: Parameter[] = []
      const handleChange = () => {}
      const { container } = render(<DynamicForm model={mockModel} onChange={handleChange} params={emptyParams} />)

      expect(container.querySelector("form")).toBeInTheDocument()
      expect(container.querySelector("form")?.children.length).toBe(0)
    })

    it("should not call onChange when params array is empty", () => {
      const emptyParams: Parameter[] = []
      let called = false
      const handleChange = () => {
        called = true
      }

      render(<DynamicForm model={mockModel} onChange={handleChange} params={emptyParams} />)

      expect(called).toBe(false)
    })
  })
})
