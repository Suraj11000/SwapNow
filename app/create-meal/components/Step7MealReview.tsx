"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { FormData } from "../page"
import { Minus, Plus, ShoppingCart, Coffee, Sun, Moon } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

interface MealItem {
  name: string
  category: string
  quantity: number
  calories: number
  protein: number
  carbs: number
  fats: number
}

export default function Step7MealReview({ formData, updateFormData }: Props) {
  const router = useRouter()
  const [meals, setMeals] = useState<{
    breakfast: MealItem[]
    lunch: MealItem[]
    dinner: MealItem[]
  }>({
    breakfast: [],
    lunch: [],
    dinner: [],
  })

  const [selectedMeals, setSelectedMeals] = useState<{
    breakfast: boolean
    lunch: boolean
    dinner: boolean
  }>({
    breakfast: true,
    lunch: false,
    dinner: false,
  })

  const [totalMacros, setTotalMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  })

  // Food database with nutritional info per 100g
  const foodDatabase: Record<string, any> = {
    "brown-rice": { name: "Brown Rice", protein: 2.6, carbs: 23, fats: 0.9, calories: 112 },
    quinoa: { name: "Quinoa", protein: 4.4, carbs: 22, fats: 1.9, calories: 120 },
    "sweet-potato": { name: "Sweet Potato", protein: 2, carbs: 24, fats: 0.1, calories: 103 },
    oats: { name: "Oats", protein: 13.2, carbs: 67, fats: 6.5, calories: 154 },
    "whole-wheat-bread": { name: "Whole Wheat Bread", protein: 3.6, carbs: 12, fats: 1.9, calories: 80 },
    "chicken-breast": { name: "Chicken Breast", protein: 31, carbs: 0, fats: 3.6, calories: 165 },
    salmon: { name: "Salmon", protein: 25, carbs: 0, fats: 12, calories: 208 },
    eggs: { name: "Eggs", protein: 13, carbs: 1.1, fats: 11, calories: 155 },
    "greek-yogurt": { name: "Greek Yogurt", protein: 10, carbs: 4, fats: 0.4, calories: 100 },
    tofu: { name: "Tofu", protein: 8, carbs: 1.9, fats: 4.8, calories: 94 },
    lentils: { name: "Lentils", protein: 9, carbs: 20, fats: 0.4, calories: 116 },
    broccoli: { name: "Broccoli", protein: 2.8, carbs: 5, fats: 0.4, calories: 25 },
    spinach: { name: "Spinach", protein: 2.9, carbs: 3.6, fats: 0.4, calories: 23 },
    "bell-peppers": { name: "Bell Peppers", protein: 1, carbs: 4.6, fats: 0.2, calories: 20 },
    carrots: { name: "Carrots", protein: 0.9, carbs: 5.8, fats: 0.2, calories: 25 },
    zucchini: { name: "Zucchini", protein: 1.2, carbs: 3.1, fats: 0.3, calories: 17 },
    tomatoes: { name: "Tomatoes", protein: 0.9, carbs: 3.9, fats: 0.2, calories: 18 },
    avocado: { name: "Avocado", protein: 2, carbs: 9, fats: 15, calories: 160 },
    "olive-oil": { name: "Olive Oil", protein: 0, carbs: 0, fats: 13.5, calories: 119 },
    almonds: { name: "Almonds", protein: 21, carbs: 22, fats: 50, calories: 164 },
    "chia-seeds": { name: "Chia Seeds", protein: 17, carbs: 42, fats: 31, calories: 137 },
    "coconut-oil": { name: "Coconut Oil", protein: 0, carbs: 0, fats: 13, calories: 117 },
  }

  const generateMeals = () => {
    const caloriesPerMeal = Math.round((formData.goalCalories * 30) / 100)
    const allSelectedFoods = [
      ...formData.selectedFoods.carbs,
      ...formData.selectedFoods.proteins,
      ...formData.selectedFoods.veggies,
      ...formData.selectedFoods.fats,
    ]

    const createMeal = (mealType: string): MealItem[] => {
      const mealItems: MealItem[] = []
      let remainingCalories = caloriesPerMeal

      // Distribute foods across meals
      allSelectedFoods.forEach((foodKey, index) => {
        const food = foodDatabase[foodKey]
        if (food && remainingCalories > 0) {
          let baseQuantity = 50 // Base serving

          // Adjust quantity based on category and remaining calories
          if (formData.selectedFoods.carbs.includes(foodKey)) {
            baseQuantity = Math.min(100, Math.round(remainingCalories / 3))
          } else if (formData.selectedFoods.proteins.includes(foodKey)) {
            baseQuantity = Math.min(120, Math.round(remainingCalories / 2))
          } else if (formData.selectedFoods.veggies.includes(foodKey)) {
            baseQuantity = 80
          } else if (formData.selectedFoods.fats.includes(foodKey)) {
            baseQuantity = Math.min(20, Math.round(remainingCalories / 8))
          }

          const multiplier = baseQuantity / 100
          const itemCalories = Math.round(food.calories * multiplier)

          if (itemCalories <= remainingCalories) {
            mealItems.push({
              name: food.name,
              category: getCategoryForFood(foodKey),
              quantity: baseQuantity,
              calories: itemCalories,
              protein: Math.round(food.protein * multiplier),
              carbs: Math.round(food.carbs * multiplier),
              fats: Math.round(food.fats * multiplier),
            })
            remainingCalories -= itemCalories
          }
        }
      })

      return mealItems
    }

    const newMeals = {
      breakfast: createMeal("breakfast"),
      lunch: createMeal("lunch"),
      dinner: createMeal("dinner"),
    }

    setMeals(newMeals)
    calculateTotalMacros(newMeals)
  }

  const getCategoryForFood = (foodKey: string) => {
    if (formData.selectedFoods.carbs.includes(foodKey)) return "Carbs"
    if (formData.selectedFoods.proteins.includes(foodKey)) return "Protein"
    if (formData.selectedFoods.veggies.includes(foodKey)) return "Vegetables"
    if (formData.selectedFoods.fats.includes(foodKey)) return "Fats"
    return "Other"
  }

  const calculateTotalMacros = (mealsData: typeof meals) => {
    // Only calculate macros for selected meals
    const selectedMealItems: MealItem[] = []

    if (selectedMeals.breakfast) selectedMealItems.push(...mealsData.breakfast)
    if (selectedMeals.lunch) selectedMealItems.push(...mealsData.lunch)
    if (selectedMeals.dinner) selectedMealItems.push(...mealsData.dinner)

    const totals = selectedMealItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fats: acc.fats + item.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    )

    setTotalMacros(totals)
    updateFormData({ totalMacros: totals, meals: mealsData })
  }

  const updateMealItemQuantity = (mealType: keyof typeof meals, itemIndex: number, newQuantity: number) => {
    if (newQuantity < 10) return

    const updatedMeals = { ...meals }
    const item = updatedMeals[mealType][itemIndex]
    const originalFood = Object.values(foodDatabase).find((f) => f.name === item.name)

    if (originalFood) {
      const multiplier = newQuantity / 100
      updatedMeals[mealType][itemIndex] = {
        ...item,
        quantity: newQuantity,
        calories: Math.round(originalFood.calories * multiplier),
        protein: Math.round(originalFood.protein * multiplier),
        carbs: Math.round(originalFood.carbs * multiplier),
        fats: Math.round(originalFood.fats * multiplier),
      }

      setMeals(updatedMeals)
      calculateTotalMacros(updatedMeals)
    }
  }

  const handleMealSelection = (mealType: keyof typeof selectedMeals, checked: boolean) => {
    const newSelectedMeals = { ...selectedMeals, [mealType]: checked }
    setSelectedMeals(newSelectedMeals)

    // Recalculate macros with new selection
    calculateTotalMacros(meals)
  }

  const getSelectedMealsForOrder = () => {
    const selectedMealPlan: any = {}
    if (selectedMeals.breakfast) selectedMealPlan.breakfast = meals.breakfast
    if (selectedMeals.lunch) selectedMealPlan.lunch = meals.lunch
    if (selectedMeals.dinner) selectedMealPlan.dinner = meals.dinner
    return selectedMealPlan
  }

  const calculateTotalPrice = () => {
    const selectedCount = Object.values(selectedMeals).filter(Boolean).length
    return selectedCount * 99 // ₹99 per meal
  }

  const handlePlaceOrder = () => {
    const selectedMealPlan = getSelectedMealsForOrder()
    const totalPrice = calculateTotalPrice()

    const orderSummary = {
      customerInfo: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        bmr: formData.bmr,
        tdee: formData.tdee,
      },
      preferences: {
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        medicalConditions: formData.medicalConditions,
        allergies: formData.allergies,
      },
      calories: {
        maintenance: formData.maintenanceCalories,
        goal: formData.goalCalories,
      },
      mealPlan: selectedMealPlan,
      selectedMeals: selectedMeals,
      nutrition: totalMacros,
      totalPrice: totalPrice,
      orderDate: new Date().toISOString(),
      orderId: `SW${Date.now()}`,
    }

    // Store order data in localStorage for the thank you page
    localStorage.setItem("orderData", JSON.stringify(orderSummary))

    console.log("Order placed:", orderSummary)

    // Redirect to thank you page
    router.push("/thank-you")
  }

  // Recalculate macros when selected meals change
  useEffect(() => {
    if (meals.breakfast.length > 0 || meals.lunch.length > 0 || meals.dinner.length > 0) {
      calculateTotalMacros(meals)
    }
  }, [selectedMeals, meals])

  useEffect(() => {
    generateMeals()
  }, [])

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return <Coffee className="w-5 h-5" />
      case "lunch":
        return <Sun className="w-5 h-5" />
      case "dinner":
        return <Moon className="w-5 h-5" />
      default:
        return null
    }
  }

  const isAnyMealSelected = Object.values(selectedMeals).some(Boolean)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Meal Plan</h2>
        <p className="text-gray-600">Choose which meals you want to order</p>
      </div>

      {/* Meal Selection */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Select Meals to Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(selectedMeals).map(([mealType, isSelected]) => (
              <div key={mealType} className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                <Checkbox
                  id={mealType}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handleMealSelection(mealType as keyof typeof selectedMeals, checked as boolean)
                  }
                />
                <div className="flex items-center space-x-2">
                  {getMealIcon(mealType)}
                  <Label htmlFor={mealType} className="capitalize cursor-pointer font-medium">
                    {mealType}
                  </Label>
                </div>
                <div className="text-sm text-gray-600">₹99</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Meals Summary */}
      {isAnyMealSelected && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle>Selected Meals Nutrition Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalMacros.calories}</div>
                <div className="text-sm text-gray-600">Total Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalMacros.protein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalMacros.carbs}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalMacros.fats}g</div>
                <div className="text-sm text-gray-600">Fats</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meal Tabs */}
      <Tabs defaultValue="breakfast" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakfast" className="flex items-center space-x-2" disabled={!selectedMeals.breakfast}>
            <Coffee className="w-4 h-4" />
            <span className="hidden sm:inline">Breakfast</span>
            <span className="sm:hidden">B</span>
            {selectedMeals.breakfast && (
              <Badge variant="secondary" className="ml-1">
                Selected
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="lunch" className="flex items-center space-x-2" disabled={!selectedMeals.lunch}>
            <Sun className="w-4 h-4" />
            <span className="hidden sm:inline">Lunch</span>
            <span className="sm:hidden">L</span>
            {selectedMeals.lunch && (
              <Badge variant="secondary" className="ml-1">
                Selected
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="dinner" className="flex items-center space-x-2" disabled={!selectedMeals.dinner}>
            <Moon className="w-4 h-4" />
            <span className="hidden sm:inline">Dinner</span>
            <span className="sm:hidden">D</span>
            {selectedMeals.dinner && (
              <Badge variant="secondary" className="ml-1">
                Selected
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {Object.entries(meals).map(([mealType, mealItems]) => (
          <TabsContent key={mealType} value={mealType}>
            <Card className={!selectedMeals[mealType as keyof typeof selectedMeals] ? "opacity-50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 capitalize">
                  {getMealIcon(mealType)}
                  <span>{mealType}</span>
                  <Badge variant="secondary">{mealItems.reduce((sum, item) => sum + item.calories, 0)} calories</Badge>
                  {!selectedMeals[mealType as keyof typeof selectedMeals] && (
                    <Badge variant="outline">Not Selected</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mealItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.calories} cal • {item.protein}g protein • {item.carbs}g carbs • {item.fats}g fats
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-2 sm:justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateMealItemQuantity(mealType as keyof typeof meals, index, item.quantity - 10)
                          }
                          disabled={!selectedMeals[mealType as keyof typeof selectedMeals]}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex flex-col items-center min-w-[80px]">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateMealItemQuantity(
                                mealType as keyof typeof meals,
                                index,
                                Number.parseInt(e.target.value) || 0,
                              )
                            }
                            className="text-center text-sm w-20 h-8"
                            disabled={!selectedMeals[mealType as keyof typeof selectedMeals]}
                          />
                          <div className="text-xs text-gray-500 mt-1">grams</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateMealItemQuantity(mealType as keyof typeof meals, index, item.quantity + 10)
                          }
                          disabled={!selectedMeals[mealType as keyof typeof selectedMeals]}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Order Summary */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ready to Order?</h3>
            <div className="text-2xl font-bold text-green-600">₹{calculateTotalPrice()}</div>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Selected meals for {formData.name}:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedMeals).map(
                ([mealType, isSelected]) =>
                  isSelected && (
                    <Badge key={mealType} variant="secondary" className="capitalize">
                      {mealType} (₹99)
                    </Badge>
                  ),
              )}
            </div>
          </div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={!isAnyMealSelected}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Place Order - ₹{calculateTotalPrice()}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
