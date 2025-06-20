import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { FormData } from "../page"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

const conditions = [
  { value: "diabetic", label: "Diabetic" },
  { value: "pcos", label: "PCOS" },
  { value: "thyroid", label: "Thyroid" },
  { value: "none", label: "None of the above" },
]

export default function Step4MedicalConditions({ formData, updateFormData }: Props) {
  const handleConditionChange = (condition: string, checked: boolean) => {
    let newConditions = [...formData.medicalConditions]

    if (condition === "none") {
      newConditions = checked ? ["none"] : []
    } else {
      if (checked) {
        newConditions = newConditions.filter((c) => c !== "none")
        newConditions.push(condition)
      } else {
        newConditions = newConditions.filter((c) => c !== condition)
      }
    }

    updateFormData({ medicalConditions: newConditions })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Conditions</h2>
        <p className="text-gray-600">
          Do you have any of these medical conditions? This helps us customize your meal plan.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {conditions.map((condition) => (
              <div key={condition.value} className="flex items-center space-x-3">
                <Checkbox
                  id={condition.value}
                  checked={formData.medicalConditions.includes(condition.value)}
                  onCheckedChange={(checked) => handleConditionChange(condition.value, checked as boolean)}
                />
                <Label htmlFor={condition.value} className="text-base cursor-pointer">
                  {condition.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
