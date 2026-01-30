import type { Parameter, ParameterModel } from "./DynamicForm"

import { useState } from "react"

import { DynamicForm } from "./DynamicForm"
import { JsonEditor } from "./JsonEditor"

const initialParameter: Parameter[] = [
  { id: 1, name: "Назначение", type: "string" },
  { id: 2, name: "Длина", type: "string" },
  { id: 3, name: "Количество", type: "number" },
]

const initialModel: ParameterModel = {
  colors: ["#ff5733", "#33ff57", "#3357ff"],
  paramValues: [
    { paramId: 1, value: "повседневное" },
    { paramId: 2, value: "макси" },
    { paramId: 3, value: 122 },
  ],
}

export const App = () => {
  const [params, setParams] = useState<Parameter[]>(initialParameter)
  const [model, setModel] = useState<ParameterModel>(initialModel)

  const handleGetModel = () => alert(JSON.stringify(model, null, 2))

  const handleModelChange = (newModel: ParameterModel) => setModel(newModel)

  return (
    <div style={{ margin: "0 auto", maxWidth: "900px", padding: "20px" }}>
      <JsonEditor initialValue={initialParameter} onChange={setParams} value={params} />

      <DynamicForm model={model} onChange={handleModelChange} params={params} />
      {params.length > 0 ? (
        <button onClick={handleGetModel} style={{ marginTop: "20px" }} type="button">
          Отправить
        </button>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>Нет параметров</div>
      )}
    </div>
  )
}
