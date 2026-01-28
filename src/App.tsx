import type { Model, Param } from "./DynamicForm"

import { useState } from "react"

const mockParams: Param[] = [
  { id: 1, name: "Назначение", type: "string" },
  { id: 2, name: "Длина", type: "string" },
]

const initialModel: Model = {
  colors: ["#ff5733", "#33ff57", "#3357ff"],
  paramValues: [
    { paramId: 1, value: "повседневное" },
    { paramId: 2, value: "макси" },
  ],
}

export const App = () => {
  const [model, setModel] = useState<Model>(initialModel)

  const handleGetModel = () => alert(JSON.stringify(model, null, 2))

  return (
    <div style={{ margin: "0 auto", maxWidth: "600px", padding: "20px" }}>
      <button onClick={handleGetModel} style={{ marginTop: "20px" }} type="button">
        Отправить
      </button>
    </div>
  )
}
