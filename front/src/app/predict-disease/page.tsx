import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import ServiceLayout from "@/components/layouts/ServiceLayout";
import PredictionCard from "@/components/predictions/PredictionCard";
import { Activity, Heart, Brain } from "lucide-react";

export default async function PredictDiseasePage() {
  const session: CustomSession | null = await getServerSession(authOptions);

  return (
    <ServiceLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold mb-6">Predict Disease</h1>
        
        {/* Prediction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <PredictionCard
            title="Diabetes Prediction"
            description="Predict the likelihood of diabetes based on various health parameters and symptoms."
            icon={<Activity className="w-6 h-6 text-primary" />}
            href="/predict-disease/diabetes"
          />
          
          <PredictionCard
            title="Heart Disease Prediction"
            description="Assess your risk of heart disease using medical indicators and lifestyle factors."
            icon={<Heart className="w-6 h-6 text-primary" />}
            href="/predict-disease/heart"
          />
          
          <PredictionCard
            title="Parkinson's Prediction"
            description="Evaluate the probability of Parkinson's disease based on voice and movement patterns."
            icon={<Brain className="w-6 h-6 text-primary" />}
            href="/predict-disease/parkinsons"
          />
        </div>

        {/* Simple Disclaimer */}
        <p className="text-sm text-gray-500 text-center mt-32">
          Note: This is an AI-powered prediction tool and should not replace professional medical advice.
        </p>
      </div>
    </ServiceLayout>
  );
} 