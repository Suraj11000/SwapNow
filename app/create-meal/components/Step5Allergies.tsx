import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { FormData } from "../page"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

const allergies = [
  { value: "lactose", label: "Lactose Intolerant" },
  { value: "gluten", label: "Gluten Sensitivity" },
  { value: "seafood", label: "Seafood Allergy" },
  { value: "nuts", label: "Nut Allergy" },
  { value: "coconut", label: "Coconut Allergy" },
]

export default function Step5Allergies({ formData, updateFormData }: Props) {
  const handleAllergyChange = (allergy: string, checked: boolean) => {
    let newAllergies = [...formData.allergies]

    if (checked) {
      newAllergies.push(allergy)
    } else {
      newAllergies = newAllergies.filter((a) => a !== allergy)
    }

    updateFormData({ allergies: newAllergies })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Allergy Check</h2>
        <p className="text-gray-600">Select any allergies or dietary restrictions you have</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {allergies.map((allergy) => (
              <div key={allergy.value} className="flex items-center space-x-3">
                <Checkbox
                  id={allergy.value}
                  checked={formData.allergies.includes(allergy.value)}
                  onCheckedChange={(checked) => handleAllergyChange(allergy.value, checked as boolean)}
                />
                <Label htmlFor={allergy.value} className="text-base cursor-pointer">
                  {allergy.label}
                </Label>
              </div>
            ))}
          </div>

          {formData.allergies.length === 0 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              No allergies selected - that's great! You'll have access to our full menu.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
