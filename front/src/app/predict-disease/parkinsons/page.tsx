'use client';

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ServiceLayout from "@/components/layouts/ServiceLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ParkinsonsPredictionPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: number;
    message: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      mdvp_fo: parseFloat(formData.get("mdvp_fo") as string),
      mdvp_fhi: parseFloat(formData.get("mdvp_fhi") as string),
      mdvp_flo: parseFloat(formData.get("mdvp_flo") as string),
      mdvp_jitter: parseFloat(formData.get("mdvp_jitter") as string),
      mdvp_jitter_abs: parseFloat(formData.get("mdvp_jitter_abs") as string),
      mdvp_rap: parseFloat(formData.get("mdvp_rap") as string),
      mdvp_ppq: parseFloat(formData.get("mdvp_ppq") as string),
      jitter_ddp: parseFloat(formData.get("jitter_ddp") as string),
      mdvp_shimmer: parseFloat(formData.get("mdvp_shimmer") as string),
      mdvp_shimmer_db: parseFloat(formData.get("mdvp_shimmer_db") as string),
      shimmer_apq3: parseFloat(formData.get("shimmer_apq3") as string),
      shimmer_apq5: parseFloat(formData.get("shimmer_apq5") as string),
      mdvp_apq: parseFloat(formData.get("mdvp_apq") as string),
      shimmer_dda: parseFloat(formData.get("shimmer_dda") as string),
      nhr: parseFloat(formData.get("nhr") as string),
      hnr: parseFloat(formData.get("hnr") as string),
      rpde: parseFloat(formData.get("rpde") as string),
      dfa: parseFloat(formData.get("dfa") as string),
      spread1: parseFloat(formData.get("spread1") as string),
      spread2: parseFloat(formData.get("spread2") as string),
      d2: parseFloat(formData.get("d2") as string),
      ppe: parseFloat(formData.get("ppe") as string)
    };

    try {
      const response = await fetch("http://localhost:5000/predict/parkinsons", {
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
      console.error("Error:", error);
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

        <h1 className="text-2xl font-bold mb-6">Parkinson's Disease Prediction</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">MDVP:Fo(Hz)</label>
              <Input
                type="number"
                name="mdvp_fo"
                required
                min="0"
                step="0.001"
                placeholder="Average vocal fundamental frequency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:Fhi(Hz)</label>
              <Input
                type="number"
                name="mdvp_fhi"
                required
                min="0"
                step="0.001"
                placeholder="Maximum vocal fundamental frequency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:Flo(Hz)</label>
              <Input
                type="number"
                name="mdvp_flo"
                required
                min="0"
                step="0.001"
                placeholder="Minimum vocal fundamental frequency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:Jitter(%)</label>
              <Input
                type="number"
                name="mdvp_jitter"
                required
                min="0"
                step="0.000001"
                placeholder="Jitter percentage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:Jitter(Abs)</label>
              <Input
                type="number"
                name="mdvp_jitter_abs"
                required
                min="0"
                step="0.000001"
                placeholder="Absolute jitter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:RAP</label>
              <Input
                type="number"
                name="mdvp_rap"
                required
                min="0"
                step="0.000001"
                placeholder="Relative amplitude perturbation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:PPQ</label>
              <Input
                type="number"
                name="mdvp_ppq"
                required
                min="0"
                step="0.000001"
                placeholder="Five-point period perturbation quotient"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Jitter:DDP</label>
              <Input
                type="number"
                name="jitter_ddp"
                required
                min="0"
                step="0.000001"
                placeholder="Average absolute difference of differences between cycles"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:Shimmer</label>
              <Input
                type="number"
                name="mdvp_shimmer"
                required
                min="0"
                step="0.000001"
                placeholder="Shimmer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:Shimmer(dB)</label>
              <Input
                type="number"
                name="mdvp_shimmer_db"
                required
                min="0"
                step="0.000001"
                placeholder="Shimmer in dB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shimmer:APQ3</label>
              <Input
                type="number"
                name="shimmer_apq3"
                required
                min="0"
                step="0.000001"
                placeholder="Three-point amplitude perturbation quotient"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shimmer:APQ5</label>
              <Input
                type="number"
                name="shimmer_apq5"
                required
                min="0"
                step="0.000001"
                placeholder="Five-point amplitude perturbation quotient"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">MDVP:APQ</label>
              <Input
                type="number"
                name="mdvp_apq"
                required
                min="0"
                step="0.000001"
                placeholder="11-point amplitude perturbation quotient"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shimmer:DDA</label>
              <Input
                type="number"
                name="shimmer_dda"
                required
                min="0"
                step="0.000001"
                placeholder="Average absolute differences between consecutive differences"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">NHR</label>
              <Input
                type="number"
                name="nhr"
                required
                min="0"
                step="0.000001"
                placeholder="Noise-to-harmonics ratio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">HNR</label>
              <Input
                type="number"
                name="hnr"
                required
                min="0"
                step="0.000001"
                placeholder="Harmonics-to-noise ratio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">RPDE</label>
              <Input
                type="number"
                name="rpde"
                required
                min="0"
                step="0.000001"
                placeholder="Recurrence period density entropy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">DFA</label>
              <Input
                type="number"
                name="dfa"
                required
                min="0"
                step="0.000001"
                placeholder="Detrended fluctuation analysis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">spread1</label>
              <Input
                type="number"
                name="spread1"
                required
                min="0"
                step="0.000001"
                placeholder="Nonlinear measure of fundamental frequency variation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">spread2</label>
              <Input
                type="number"
                name="spread2"
                required
                min="0"
                step="0.000001"
                placeholder="Nonlinear measure of fundamental frequency variation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">D2</label>
              <Input
                type="number"
                name="d2"
                required
                min="0"
                step="0.000001"
                placeholder="Correlation dimension"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">PPE</label>
              <Input
                type="number"
                name="ppe"
                required
                min="0"
                step="0.000001"
                placeholder="Pitch period entropy"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Predicting..." : "Get Prediction"}
          </Button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Prediction Result</h2>
            <p className="text-lg">
              {result.prediction === 1
                ? "The model predicts that the patient has Parkinson's disease."
                : "The model predicts that the patient does not have Parkinson's disease."}
            </p>
          </div>
        )}

        <p className="mt-8 text-sm text-gray-500 text-center">
          Note: This is an AI-powered prediction tool and should not replace professional medical advice.
        </p>
      </div>
    </ServiceLayout>
  );
} 