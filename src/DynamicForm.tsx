import React from "react"

export interface Parameter {
  id: number
  name: string
  type: string
}

export interface ParameterValue {
  paramId: number
  value: string | number
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
  values: Record<number, string | number>
}

export class DynamicForm extends React.Component<DynamicFormProps, DynamicFormState> {
  constructor(props: DynamicFormProps) {
    super(props)

    const { params = [], model } = props

    const values = Object.fromEntries(
      params.map((param) => [param.id, model.paramValues.find((pv) => pv.paramId === param.id)?.value ?? ""])
    )

    this.state = { values }
  }

  handleChange = (paramId: number, value: string) => {
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

    const paramValues: ParameterValue[] = params.map((param) => ({
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
            return (
              <div data-testid={`param-field-${param.id}`} key={param.id}>
                <label htmlFor={`param-${param.id}`}>{param.name}</label>
                <input
                  data-testid={`param-input-${param.id}`}
                  id={`param-${param.id}`}
                  onChange={(e) => this.handleChange(param.id, e.target.value)}
                  type="text"
                  value={values[param.id] || ""}
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
