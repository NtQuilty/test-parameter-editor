import React from "react"

export interface Parameter {
  id: number
  name: string
  type: string
}

export type ParameterValueType = string | number | boolean | null | undefined | Date

export interface ParameterValue {
  paramId: number
  value: ParameterValueType
}

export interface ParameterModel {
  paramValues: ParameterValue[]
  colors: string[]
}

export interface DynamicFormProps {
  params: Parameter[]
  model: ParameterModel
  onChange: (model: ParameterModel) => void
}

const ParameterType = {
  Boolean: "boolean",
  Checkbox: "checkbox",
  Date: "date",
  Number: "number",
  Radio: "radio",
  Select: "select",
  String: "string",
} as const

interface DynamicFormState {
  values: Record<number, ParameterValueType>
}

export class DynamicForm extends React.Component<DynamicFormProps, DynamicFormState> {
  constructor(props: DynamicFormProps) {
    super(props)

    const { model } = props

    const values = Object.fromEntries(model.paramValues.map((pv) => [pv.paramId, pv.value]))

    this.state = { values }
  }

  handleChange = (paramId: number, value: ParameterValueType) => {
    this.setState(
      (prevState) => ({
        values: {
          ...prevState.values,
          [paramId]: value,
        },
      }),
      () => this.props.onChange(this.getModel())
    )
  }

  getModel(): ParameterModel {
    const { params, model } = this.props
    const { values } = this.state

    const paramValues: ParameterValue[] = params
      .filter((param) => param.type === ParameterType.String)
      .map((param) => ({
        paramId: param.id,
        value: values[param.id] || "",
      }))

    return {
      colors: model.colors,
      paramValues,
    }
  }

  render() {
    const { params } = this.props
    const { values } = this.state

    return (
      <form>
        {params.map((param) => {
          if (param.type === ParameterType.String) {
            const newValue = values[param.id] || ""

            return (
              <div data-testid={`param-field-${param.id}`} key={param.id}>
                <label htmlFor={`param-${param.id}`}>{param.name}</label>
                <input
                  data-testid={`param-input-${param.id}`}
                  id={`param-${param.id}`}
                  onChange={(e) => this.handleChange(param.id, e.target.value)}
                  type="text"
                  value={String(newValue ?? "")}
                />
              </div>
            )
          }

          return null
        })}
      </form>
    )
  }
}
