"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import ServiceLayout from "@/components/layouts/ServiceLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DiabetesPredictionPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: number;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      pregnancies: parseFloat(formData.get("pregnancies") as string),
      glucose: parseFloat(formData.get("glucose") as string),
      blood_pressure: parseFloat(formData.get("blood_pressure") as string),
      skin_thickness: parseFloat(formData.get("skin_thickness") as string),
      insulin: parseFloat(formData.get("insulin") as string),
      bmi: parseFloat(formData.get("bmi") as string),
      diabetes_pedigree: parseFloat(formData.get("diabetes_pedigree") as string),
      age: parseFloat(formData.get("age") as string),
    };

    try {
      const response = await fetch("http://localhost:5000/predict/diabetes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const result = await response.json();
      setResult(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceLayout session={session}>
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href="/predict-disease"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Predictions
        </Link>

        <h1 className="text-2xl font-bold mb-6">Diabetes Prediction</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Pregnancies</label>
              <Input
                type="number"
                name="pregnancies"
                required
                min="0"
                step="1"
                placeholder="Enter number of pregnancies"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Glucose Level (mg/dL)</label>
              <Input
                type="number"
                name="glucose"
                required
                min="0"
                step="0.1"
                placeholder="Enter glucose level"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Blood Pressure (mm Hg)</label>
              <Input
                type="number"
                name="blood_pressure"
                required
                min="0"
                step="0.1"
                placeholder="Enter blood pressure"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Skin Thickness (mm)</label>
              <Input
                type="number"
                name="skin_thickness"
                required
                min="0"
                step="0.1"
                placeholder="Enter skin thickness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Insulin Level (mu U/ml)</label>
              <Input
                type="number"
                name="insulin"
                required
                min="0"
                step="0.1"
                placeholder="Enter insulin level"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">BMI (kg/m²)</label>
              <Input
                type="number"
                name="bmi"
                required
                min="0"
                step="0.1"
                placeholder="Enter BMI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Diabetes Pedigree Function</label>
              <Input
                type="number"
                name="diabetes_pedigree"
                required
                min="0"
                step="0.001"
                placeholder="Enter diabetes pedigree function"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age (years)</label>
              <Input
                type="number"
                name="age"
                required
                min="0"
                step="1"
                placeholder="Enter age"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Predicting..." : "Get Prediction"}
          </Button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Prediction Result</h2>
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-medium">Result:</span>{" "}
                <span className={result.prediction === 1 ? "text-red-600" : "text-green-600"}>
                  {result.message}
                </span>
              </p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 text-center mt-8">
          Note: This is an AI-powered prediction tool and should not replace professional medical advice.
        </p>
      </div>
    </ServiceLayout>
  );
} 